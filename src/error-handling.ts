import { isPresent } from '@ember/utils'
import type { ValidationOptions } from '#src/common.ts'

/**
 * Gets thrown when a constraint is not recognised
 */
export class UnknownConstraintError extends Error {}

/**
 * Gets the most appropriate error message given the current context.
 * This is called after a constraint is failed.
 * @param value The current value of the field that originated the error
 * @param field The name of the model's field being validated
 * @param options The validation options provided
 * @param constraintName The name of the constraint that originated the error
 * @param defaultMessage The default message error to be returned
 * @returns One of the following, in this order:
 *   1. `options.message` if it exists,
 *   2. The value returned by `options.i18nHandler.t` method if available,
 *       1. when called with `options.translationKey` if it exists, or else
 *       2. when called with `validation.${constraint}`
 *   3. `defaultMessage`
 */
export function messageForError<Options extends ValidationOptions>(
  value: unknown,
  field: string|symbol,
  options: Options,
  constraintName: string,
  defaultMessage: string,
) {
  const { message, translationKey, i18nHandler, ...otherOptions } = options
  if(isPresent(message)) {
    return message
  }

  const errorKey = translationKey ?? `validation.${constraintName}`
  if(i18nHandler?.exists(errorKey)) {
    const translationOptions =
      { constraint: constraintName, field, value, ...otherOptions }
    return i18nHandler.t(errorKey, translationOptions)
  }

  return defaultMessage
}
