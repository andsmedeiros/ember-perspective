
import { isNone } from '@ember/utils';
import { messageForError, InvalidValueForConstraintError } from './error.js';
import { hasLength } from './type-utils/has-length.js';
import { isEmailValid } from './utils/email-format.js';
import { isUUIDValid } from './utils/uuid-format.js';

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
function validatePresence(model, field, value, options) {
  if (isNone(value)) {
    const defaultMessage = `Must be present`;
    return messageForError(model, field, value, 'presence', defaultMessage, options);
  }
}
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
function validateAbsence(model, field, value, options) {
  if (!isNone(value)) {
    const defaultMessage = `Must not be present`;
    return messageForError(model, field, value, 'absence', defaultMessage, options);
  }
}

/**
 * Contains a type name to be checked against `typeof` output
 */

/**
 * Validates whether `tyepof value` is the same as provided in `options.type`.
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateType(model, field, value, options) {
  if (typeof value !== options.type) {
    const defaultMessage = `Must be a ${options.type}`;
    return messageForError(model, field, value, 'type', defaultMessage, options);
  }
}

/**
 * Contains a class against which values will be tested
 */

/**
 * Validates whether `value` is an instance of `options.Constructor`
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateInstance(model, field, value, options) {
  if (!(value instanceof options.Constructor)) {
    const defaultMessage = `Must be an instance of ${options.Constructor.name}`;
    return messageForError(model, field, value, 'type', defaultMessage, options);
  }
}

/**
 * Contains optional upper and lower limits for numeric validation
 */

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
function validateLength(model, field, value, options) {
  if (!hasLength(value)) {
    const errorMessage = 'Constrained field should have a numeric `length` property';
    throw new InvalidValueForConstraintError(errorMessage);
  }
  const {
    length
  } = value;
  const {
    minimum,
    maximum
  } = options;
  if (minimum !== undefined && maximum !== undefined) {
    if (length < minimum || length > maximum) {
      const defaultMessage = `Length must be between ${minimum} and ${maximum}`;
      return messageForError(model, field, value, 'length.interval', defaultMessage, options);
    }
  } else if (minimum !== undefined) {
    if (length < minimum) {
      const defaultMessage = `Length must be greater than ${minimum}`;
      return messageForError(model, field, value, 'length.minimum', defaultMessage, options);
    }
  } else if (maximum !== undefined) {
    if (length > maximum) {
      const defaultMessage = `Length must be less than ${maximum}`;
      return messageForError(model, field, value, 'length.maximum', defaultMessage, options);
    }
  }
}
/**
 * Validates whether `value` contains a valid e-mail address.
 *
 * Will throw `InvalidValueForConstraintError` if `value` is not a string.
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateEmail(model, field, value, options) {
  if (typeof value !== 'string') {
    const errorMessage = `Must be a string`;
    throw new InvalidValueForConstraintError(errorMessage);
  }
  if (!isEmailValid(value)) {
    const defaultMessage = `Must be a valid email address`;
    return messageForError(model, field, value, 'email', defaultMessage, options);
  }
}

/**
 * Contains a regular expression against which to match the provided value
 */

/**
 * Validates whether `value` matches the provided regular expression.
 *
 * Will throw `InvalidValueForConstraintError` if `value` is not a string.
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateFormat(model, field, value, options) {
  if (typeof value !== 'string') {
    const errorMessage = `Must be a string`;
    throw new InvalidValueForConstraintError(errorMessage);
  }
  if (!value.match(options.pattern)) {
    const defaultMessage = `Must have a valid format`;
    return messageForError(model, field, value, 'format', defaultMessage, options);
  }
}

/**
 * Contains the name of the field against which the provided value
 * should be checked for identity
 */

/**
 * Validates whether `value` is identical to `model[options.on]`
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateConfirmation(model, field, value, options) {
  if (value !== model[options.on]) {
    const defaultMessage = `Must match '${String(options.on)}'`;
    return messageForError(model, field, value, 'confirmation', defaultMessage, options);
  }
}

/**
 * Stores an array of elements allowed
 */

/**
 * Validates whether `value` is included in `options.in`
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateInclusion(model, field, value, options) {
  if (!options.in.includes(value)) {
    const defaultMessage = 'Must be an allowed value';
    return messageForError(model, field, value, 'inclusion', defaultMessage, options);
  }
}

/**
 * Stores an array of elements disallowed
 */

/**
 * Validates whether `value` is not included in `options.from`
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateExclusion(model, field, value, options) {
  if (options.from.includes(value)) {
    const defaultMessage = 'Must not be a disallowed value';
    return messageForError(model, field, value, 'inclusion', defaultMessage, options);
  }
}
/**
 * Validates whether `value` contains a valid UUID. Hyphens, periods and
 * whitespaces are ignored.
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateUUID(model, field, value, options) {
  if (typeof value !== 'string') {
    const errorMessage = `Must be a string`;
    throw new InvalidValueForConstraintError(errorMessage);
  }
  if (!isUUIDValid(value)) {
    const defaultMessage = 'Must contain a valid UUID';
    return messageForError(model, field, value, 'uuid', defaultMessage, options);
  }
}

/**
 * Contains a user-provide validator function to be used in custom validations.
 */

/**
 * Validates whether `value` satisfies the constraint defined by the
 * passed validator function.
 * @param model
 * @param field
 * @param value
 * @param options
 */
function validateCustom(model, field, value, options) {
  return options.with(model, field, value, options);
}

export { validateAbsence, validateConfirmation, validateCustom, validateEmail, validateExclusion, validateFormat, validateInclusion, validateInstance, validateLength, validatePresence, validateType, validateUUID };
//# sourceMappingURL=validators.js.map
