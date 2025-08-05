import type { ConstraintOptions, Field, Model } from './common.ts'
import {
  InvalidValueForConstraintError,
  RequiredOptionMissingError,
  UnknownConstraintError,
} from './error.ts'
import { TYPE_VALUES, type Type } from './type-utils/object-natures.ts'
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
  type FormatConstraintOptions,
  type ConfirmationConstraintOptions,
  type InclusionConstraintOptions,
  type CustomConstraintOptions,
  type TypeConstraintOptions,
  type InstanceConstraintOptions,
  type ExclusionConstraintOptions,
} from './validators.ts'

export interface CoreOptions extends ConstraintOptions {
  if?(value: unknown, model: Model, field: Field): boolean | Promise<boolean>
}

async function validateConstraint<Options extends CoreOptions>(
  model: Model,
  field: Field,
  constraint: string,
  options: Options | true,
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

    case 'absence':
      return validateAbsence(model, field, value, options)

    case 'type':
      if (!('type' in options) || !TYPE_VALUES.includes(options.type as Type)) {
        const errorMessage = 'A valid type string must be supplied'
        throw new RequiredOptionMissingError(errorMessage)
      }

      return validateType(model, field, value, options as TypeConstraintOptions)

    case 'instance':
      if (
        !('Constructor' in options) ||
        typeof options.constructor !== 'function'
      ) {
        const errorMessage = 'A valid constructor or class must be supplied'
        throw new InvalidValueForConstraintError(errorMessage)
      }

      return validateInstance(
        model,
        field,
        value,
        options as InstanceConstraintOptions<never>,
      )

    case 'length':
      return validateLength(model, field, value, options)

    case 'email':
      return validateEmail(model, field, value, options)

    case 'format':
      if (!('pattern' in options) || !(options.pattern instanceof RegExp)) {
        const errorMessage = 'Pattern for validation must be supplied'
        throw new RequiredOptionMissingError(errorMessage)
      }
      return validateFormat(
        model,
        field,
        value,
        options as FormatConstraintOptions,
      )

    case 'confirmation':
      if (
        !('on' in options) ||
        !['string', 'number', 'symbol'].includes(typeof options.on)
      ) {
        const errorMessage =
          'The name of the confirmation field must be provided'
        throw new RequiredOptionMissingError(errorMessage)
      }
      return validateConfirmation(
        model,
        field,
        value,
        options as ConfirmationConstraintOptions,
      )

    case 'inclusion':
      if (!('in' in options) || !Array.isArray(options.in)) {
        const errorMessage = 'An array of the accepted values must be provided'
        throw new RequiredOptionMissingError(errorMessage)
      }
      return validateInclusion(
        model,
        field,
        value,
        options as InclusionConstraintOptions,
      )

    case 'exclusion':
      if (!('from' in options) || !Array.isArray(options.from)) {
        const errorMessage = 'An array of the rejected values must be provided'
        throw new RequiredOptionMissingError(errorMessage)
      }

      return validateExclusion(
        model,
        field,
        value,
        options as ExclusionConstraintOptions,
      )

    case 'uuid':
      return validateUUID(model, field, value, options)

    case 'custom':
      if (!('with' in options) || typeof options.with !== 'function') {
        const errorMessage = 'A custom validator function must be provided'
        throw new RequiredOptionMissingError(errorMessage)
      }
      return validateCustom(
        model,
        field,
        value,
        options as CustomConstraintOptions,
      )

    default:
      throw new UnknownConstraintError(`Unknown constraint ${constraint}`)
  }
}

export type FieldValidationHaltBy = 'never' | 'first-error'
export type FieldConstraints = Record<string, CoreOptions>

/**
 * Takes a model, the name of a field of that model and a set of constraints,
 * then validates the model's field
 * @param model The object whose property should be validated
 * @param field The name of the model's field to be validated
 * @param constraints An object describing which constraints should be applied
 * when validating the field. Keys must contain a known constraint name and values must
 * contain supported configuration options for each corresponding constraint
 * @param haltBy Whether to abort validation after a constraint fails
 * @returns An array of error messages, if any. If all constraints were
 * successful, returns an empty array.
 */
export async function validateField(
  model: Model,
  field: Field,
  constraints: FieldConstraints,
  { haltBy = 'never' }: { haltBy?: FieldValidationHaltBy } = {},
) {
  const result = []

  for (const [constraint, options] of Object.entries(constraints) ?? {}) {
    const error = await validateConstraint(model, field, constraint, options)

    if (error) {
      result.push(error)
      if (haltBy === 'first-error') break
    }
  }

  return result
}

export type ModelValidationHaltBy =
  | 'never'
  | 'first-error'
  | 'first-field-error'
export type ModelConstraints = Record<string, FieldConstraints>

/**
 * Takes a model and a set of constraints, then validates the model
 * @param model The object to be validated
 * @param modelConstraints An object describing what fields should be validated
 * and which constraints to apply to each of them. Keys must contain the name of a field
 * and values must contain the constraint definitions for each corresponding field
 * @param haltBy {} When to halt validation
 *   1. `never`: Never halts
 *   2. `first-error`: Halts after any constraint fails in any field; fields not validated
 *      will remain so
 *   3. `first-field-error`: Halts after the first constraint fail for each field; all fields
 *      will be validated
 * @returns An object containing each validated field's error messages, if any.
 * If all constraints were successful for some field, its error array will be empty.
 */
export async function validate(
  model: Model,
  modelConstraints: ModelConstraints,
  { haltBy = 'never' }: { haltBy?: ModelValidationHaltBy } = {},
) {
  const result: Record<string, string[]> = {}

  for (const [field, constraints] of Object.entries(modelConstraints)) {
    const haltFieldValidationBy = haltBy !== 'never' ? 'first-error' : 'never'
    const errors = await validateField(model, field, constraints, {
      haltBy: haltFieldValidationBy,
    })

    if (errors.length > 0) {
      result[field] = errors
      if (haltBy === 'first-error') break
    }
  }

  return result
}
