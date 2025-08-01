import { isPresent } from '@ember/utils'
import type { ValidationOptions } from '#src/common.ts'

/**
 * Gets thrown when a constraint is not recognised
 */
export class UnknownConstraintError extends Error {}

/**
 * Gets the most appropriate error message given the current context.
 * This is called after a constraint is failed.
 * @param constraint The name of the constraint that originated the error
 * @param field The name of the model's field being validated
 * @param value The current value of the field that originated the error
 * @param defaultMessage The default message error to be returned
 * @param options The validation options provided
 * @returns One of the following, in this order:
 *   1. `options.message` if it exists,
 *   2. The value returned by `options.i18n.handler.t` method if available,
 *       1. when called with `options.i18n.key` if it exists, or else
 *       2. when called with `validation.${constraint}`
 *   3. `defaultMessage`
 */
export function messageForError<Options extends ValidationOptions>(
  constraint: string,
  field: string | symbol,
  value: unknown,
  defaultMessage: string,
  options: Options,
) {
  const { message, i18n, ...otherOptions } = options
  if (isPresent(message)) {
    return message
  }

  const errorKey = i18n?.key ?? `validation.${constraint}`
  if (i18n?.handler?.exists(errorKey)) {
    return i18n.handler.t(errorKey, {
      constraint,
      field,
      value,
      ...otherOptions,
    })
  }

  return defaultMessage
}
