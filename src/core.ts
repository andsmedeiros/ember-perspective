import type { ConstraintOptions, Field, Model } from './common.ts'
import { RequiredOptionMissingError, UnknownConstraintError } from './error.ts'
import { hasProperty } from './type-utils/has-property.ts'

import {
  validatePresence,
  validateAbsence,
  validateType,
  validateInstance,
  validateLength,
  validateEmail,
  validateFormat,
  validateConfirmation,
  validateInclusion,
  validateExclusion,
  validateUUID,
  validateCustom,
} from './validators.ts'

export interface CoreOptions extends ConstraintOptions {
  if?(value: unknown, model: Model, field: Field): boolean | Promise<boolean>
}

async function validateConstraint<Options extends CoreOptions>(
  model: Model,
  field: Field,
  constraint:
  string, options: Options | true
) {
  if (options === true) {
    options = {} as Options
  }

  const value = model[field]

  if (
    typeof options.if === 'function' &&
    !(await options.if(value, model, field))
  )
    return

  switch (constraint) {
    case 'presence':
      return validatePresence(model, field, value, options)
    case 'length':
      return validateLength(model, field, value, options)
    case 'email':
      return validateEmail(model, field, value, options)
    case 'format':
      if(!hasProperty(options, 'pattern', RegExp)) {
        const errorMessage = 'A valid pattern was not provided for format validation'
        throw new RequiredOptionMissingError(errorMessage)
      }
      return validateFormat(model, field, value, options)
    case 'confirmation':
      return validateConfirmation(model, field, value, options)
    case 'inclusion':
      return validateInclusion(model, field, value, options)
    case 'uuid':
      return validateUUID(model, field, value, options)
    case 'custom':
      return validateCustom(model, field, value, options)
    default:
      throw new UnknownConstraintError(`Unknown constraint ${constraint}`)
  }
}

/**
 * Takes a model, the name of a field of that model and a set of constraints,
 * then validates the model's field
 * @param model {Object} The object whose property should be validated
 * @param field {String|Symbol} The name of the model's field to be validated
 * @param constraints {Object} An object describing which constraints should be applied
 * when validating the field. Keys must contain a known constraint name and values must
 * contain supported configuration options for each corresponding constraint
 * @param haltBy {'never'|'first-error'} Whether to abort validation after a constraint fails
 * @returns {Promise<String[]>} An array of error messages, if any. If all constraints were
 * successful, returns an empty array.
 */
export async function validateField(
  model,
  field,
  { constraints, haltBy = 'never' },
) {
  const result = []

  for (const [constraint, options] of entries(constraints) ?? {}) {
    const error = await validateConstraint(model, field, constraint, options)

    if (error) {
      result.push(error)
      if (haltBy === 'first-error') break
    }
  }

  return result
}

/**
 * Takes a model and a set of constraints, then validates the model
 * @param model {Object} The object to be validated
 * @param modelConstraints {Object} An object describing what fields should be validated
 * and which constraints to apply to each of them. Keys must contain the name of a field
 * and values must contain the constraint definitions for each corresponding field
 * @param haltBy {'never'|'first-error'|'first-field-error'} When to halt validation
 *   1. `never`: Never halts
 *   2. `first-error`: Halts after any constraint fails in any field; fields not validated
 *      will remain so
 *   3. `first-field-error`: Halts after the first constraint fail for each field; all fields
 *      will be validated
 * @returns {Promise<{(String|Symbol): String[]}>} An object containing each validated field's error messages, if any.
 * If all constraints were successful for some field, its error array will be empty.
 */
export async function validate(model, { modelConstraints, haltBy = 'never' }) {
  const result = {}

  for (const [field, constraints] of entries(modelConstraints ?? {})) {
    const haltFieldValidationBy = haltBy !== 'never' ? 'first-error' : 'never'
    const errors = await validateField(model, field, {
      constraints,
      haltBy: haltFieldValidationBy,
    })

    if (errors.length > 0) {
      result[field] = errors
      if (haltBy === 'first-error') break
    }
  }

  return result
}
