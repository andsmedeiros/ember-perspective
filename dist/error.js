
import { isPresent } from '@ember/utils';

/**
 * Gets thrown when a constraint is not recognised
 */
class UnknownConstraintError extends Error {}

/**
 * Gets thrown when a value cannot be constrained because it
 * has an unexpected value type
 */
class InvalidValueForConstraintError extends Error {}

/**
 * Gets thrown when a validation is requested but some
 * mandatory option is absent.
 */
class RequiredOptionMissingError extends Error {}

/**
 * Gets the most appropriate error message given the current context.
 * This is called after a constraint is failed.
 * @param model The model being validated
 * @param field The name of the model's field being validated
 * @param value The current value of the field that originated the error
 * @param constraint The name of the constraint that originated the error
 * @param defaultMessage The default message error to be returned
 * @param options The validation options provided
 * @returns One of the following, in this order:
 *   1. `options.message` if it exists,
 *   2. The value returned by `options.i18n.handler.t` method if available,
 *       1. when called with `options.i18n.key` if it exists, or else
 *       2. when called with `validation.${constraint}`
 *   3. `defaultMessage`
 */
function messageForError(model, field, value, constraint, defaultMessage, options) {
  const {
    message,
    i18n,
    ...otherOptions
  } = options;
  if (isPresent(message)) {
    return message;
  }
  const errorKey = i18n?.key ?? `validation.${constraint}`;
  if (i18n?.handler?.exists(errorKey)) {
    return i18n.handler.t(errorKey, {
      constraint,
      model,
      field,
      value,
      ...otherOptions
    });
  }
  return defaultMessage;
}

export { InvalidValueForConstraintError, RequiredOptionMissingError, UnknownConstraintError, messageForError };
//# sourceMappingURL=error.js.map
