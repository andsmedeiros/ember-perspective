import type { ConstraintOptions, Field, Model } from './common.ts';
/**
 * Gets thrown when a constraint is not recognised
 */
export declare class UnknownConstraintError extends Error {
}
/**
 * Gets thrown when a value cannot be constrained because it
 * has an unexpected value type
 */
export declare class InvalidValueForConstraintError extends Error {
}
/**
 * Gets thrown when a validation is requested but some
 * mandatory option is absent.
 */
export declare class RequiredOptionMissingError extends Error {
}
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
export declare function messageForError<Options extends ConstraintOptions>(model: Model, field: Field, value: unknown, constraint: string, defaultMessage: string, options: Options): string;
//# sourceMappingURL=error.d.ts.map