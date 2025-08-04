import type {
  ConstraintOptions,
  Field,
  Model,
  ValidatorFunction
} from './common.ts'

import { isNone } from '@ember/utils'
import { InvalidValueForConstraintError, messageForError } from './error.ts'
import { hasLength } from './type-utils/has-length.ts'
import { isEmailValid } from './utils/email-format.ts'
import { isUUIDValid } from './utils/uuid-format.ts'

export type PresenceConstraintOptions = ConstraintOptions

/**
 * Validates whether `value` is present -- not `null`
 * and not `undefined`.
 *
 * This is done by calling `@ember/utils#isNone`.
 * @param model
 * @param field
 * @param value
 * @param options
 * @see isNone
 */
export function validatePresence(model: Model, field: Field, value: unknown, options: PresenceConstraintOptions) {
  if (isNone(value)) {
    const defaultMessage = `Must be present`
    return messageForError(
      model,
      field,
      value,
      'presence',
      defaultMessage,
      options,
    )
  }
}

export type AbsenceConstraintOptions = ConstraintOptions

/**
 * Validates whether `value` is absent -- either `null`
 * or `undefined`.
 *
 * This is done by calling `@ember/utils#isNone`.
 * @param model
 * @param field
 * @param value
 * @param options
 * @see isNone
 */
export function validateAbsence(model: Model, field: Field, value: unknown, options: PresenceConstraintOptions) {
  if(!isNone(value)) {
    const defaultMessage = `Must not be present`
    return messageForError(model, field, value, 'absence', defaultMessage, options)
  }
}

/**
 * Contains a type name to be checked against `typeof` output
 */
export interface TypeConstraintOptions extends ConstraintOptions {
  type: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined'
}

/**
 * Validates whether `tyepof value` is the same as provided in `options.type`.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateType(model: Model, field: Field, value: unknown, options: TypeConstraintOptions) {
  if(typeof value !== options.type) {
    const defaultMessage = `Must be a ${options.type}`
    return messageForError(model, field, value, 'type', defaultMessage, options)
  }
}

/**
 * Contains a class against which values will be tested
 */
export interface InstanceConstraintOptions<T> extends ConstraintOptions {
  Constructor: {
    new(...args: never[]): T
  }
}

/**
 * Validates whether `value` is an instance of `options.Constructor`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateInstance<T>(model: Model, field: Field, value: unknown, options: InstanceConstraintOptions<T>) {
  if(!(value instanceof options.Constructor)) {
    const defaultMessage = `Must be an instance of ${options.Constructor.name}`
    return messageForError(model, field, value, 'type', defaultMessage, options)
  }
}

/**
 * Contains optional upper and lower limits for numeric validation
 */
export interface LengthConstraintOptions extends ConstraintOptions {
  minimum?: number
  maximum?: number
}

/**
 * Validates whether `value.length`'s numeric value is comprised
 * between `options.minimum` and `options.maximum`, inclusive.
 *
 * Both boundaries are optional and, if none is provided, no validation
 * is performed.
 *
 * This will throw a `InvalidValueForConstraintError` if `value.length` is not
 * a number.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateLength(model: Model, field: Field, value: unknown, options: LengthConstraintOptions) {
  if(!hasLength(value)) {
    const errorMessage = 'Constrained field should have a numeric `length` property'
    throw new InvalidValueForConstraintError(errorMessage)
  }

  const { length } = value
  const { minimum, maximum } = options

  if (minimum !== undefined && maximum !== undefined) {
    if (length < minimum || length > maximum) {
      const defaultMessage = `Length must be between ${minimum} and ${maximum}`
      return messageForError(
        model,
        field,
        value,
        'length.interval',
        defaultMessage,
        options,
      )
    }
  } else if (minimum !== undefined) {
    if (length < minimum) {
      const defaultMessage = `Length must be greater than ${minimum}`
      return messageForError(
        model,
        field,
        value,
        'length.minimum',
        defaultMessage,
        options,
      )
    }
  } else if (maximum !== undefined) {
    if (length > maximum) {
      const defaultMessage = `Length must be less than ${maximum}`
      return messageForError(
        model,
        field,
        value,
        'length.maximum',
        defaultMessage,
        options,
      )
    }
  }
}

export type EmailConstraintOptions = ConstraintOptions

/**
 * Validates whether `value` contains a valid e-mail address.
 *
 * Will throw `InvalidValueForConstraintError` if `value` is not a string.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateEmail(model: Model, field: Field, value: unknown, options: EmailConstraintOptions) {
  if(typeof value !== 'string') {
    const errorMessage = `Must be a string`
    throw new InvalidValueForConstraintError(errorMessage)
  }

  if (!isEmailValid(value)) {
    const defaultMessage = `Must be a valid email address`
    return messageForError(model, field, value, 'email', defaultMessage, options)
  }
}

/**
 * Contains a regular expression against which to match the provided value
 */
export interface FormatConstraintOptions extends ConstraintOptions {
  with: RegExp
}

/**
 * Validates whether `value` matches the provided regular expression.
 *
 * Will throw `InvalidValueForConstraintError` if `value` is not a string.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateFormat(model: Model, field: Field, value: unknown, options: FormatConstraintOptions)  {
  if(typeof value !== 'string') {
    const errorMessage = `Must be a string`
    throw new InvalidValueForConstraintError(errorMessage)
  }

  if (!value.match(options.with)) {
    const defaultMessage = `Must have a valid format`
    return messageForError(
      model,
      field,
      value,
      'format',
      defaultMessage,
      options,
    )
  }
}

/**
 * Contains the name of the field against which the provided value
 * should be checked for identity
 */
export interface ConfirmationConstraintOptions extends ConstraintOptions {
  on: Field
}

/**
 * Validates whether `value` is identical to `model[options.on]`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateConfirmation(model: Model, field: Field, value: unknown, options: ConfirmationConstraintOptions) {
  if (value !== model[options.on]) {
    const defaultMessage = `Must match '${String(options.on)}'`
    return messageForError(
      model,
      field,
      value,
      'confirmation',
      defaultMessage,
      options,
    )
  }
}

/**
 * Stores an array of elements allowed
 */
export interface InclusionConstraintOptions extends ConstraintOptions {
  in: unknown[]
}

/**
 * Validates whether `value` is included in `options.in`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateInclusion(model: Model, field: Field, value: unknown, options: InclusionConstraintOptions) {
  if (!options.in.includes(value)) {
    const defaultMessage = 'Must be an allowed value'
    return messageForError(
      model,
      field,
      value,
      'inclusion',
      defaultMessage,
      options,
    )
  }
}

/**
 * Stores an array of elements disallowed
 */
export interface ExclusionConstraintOptions extends ConstraintOptions {
  from: unknown[]
}

/**
 * Validates whether `value` is not included in `options.from`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateExclusion(model: Model, field: Field, value: unknown, options: ExclusionConstraintOptions) {
  if (options.from.includes(value)) {
    const defaultMessage = 'Must not be a disallowed value'
    return messageForError(
      model,
      field,
      value,
      'inclusion',
      defaultMessage,
      options,
    )
  }
}

export type UUIDConstraintOptions = ConstraintOptions

/**
 * Validates whether `value` contains a valid UUID. Hyphens, periods and
 * whitespaces are ignored.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateUUID(model: Model, field: Field, value: unknown, options: UUIDConstraintOptions) {
  if(typeof value !== 'string') {
    const errorMessage = `Must be a string`
    throw new InvalidValueForConstraintError(errorMessage)
  }

  if (!isUUIDValid(value)) {
    const defaultMessage = 'Must contain a valid UUID'
    return messageForError(model, field, value, 'uuid', defaultMessage, options)
  }
}

/**
 * Contains a user-provide validator function to be used in custom validations.
 */
export interface CustomConstraintOptions extends ConstraintOptions {
  with: ValidatorFunction<this>
}

/**
 * Validates whether `value` satisfies the constraint defined by the
 * passed validator function.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export function validateCustom<Options extends CustomConstraintOptions>(
  model: Model,
  field: Field,
  value: unknown,
  options: Options
) {
  return options.with(model, field, value, options)
}
