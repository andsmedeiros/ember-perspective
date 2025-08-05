import type { ConstraintOptions, Field, Model, ValidatorFunction } from './common.ts';
import type { Constructor, Type } from './type-utils/object-natures.ts';
export type PresenceConstraintOptions = ConstraintOptions;
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
export declare function validatePresence(model: Model, field: Field, value: unknown, options: PresenceConstraintOptions): string | undefined;
export type AbsenceConstraintOptions = ConstraintOptions;
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
export declare function validateAbsence(model: Model, field: Field, value: unknown, options: AbsenceConstraintOptions): string | undefined;
/**
 * Contains a type name to be checked against `typeof` output
 */
export interface TypeConstraintOptions extends ConstraintOptions {
    type: Type;
}
/**
 * Validates whether `tyepof value` is the same as provided in `options.type`.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateType(model: Model, field: Field, value: unknown, options: TypeConstraintOptions): string | undefined;
/**
 * Contains a class against which values will be tested
 */
export interface InstanceConstraintOptions<T> extends ConstraintOptions {
    Constructor: Constructor<T>;
}
/**
 * Validates whether `value` is an instance of `options.Constructor`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateInstance<T>(model: Model, field: Field, value: unknown, options: InstanceConstraintOptions<T>): string | undefined;
/**
 * Contains optional upper and lower limits for numeric validation
 */
export interface LengthConstraintOptions extends ConstraintOptions {
    minimum?: number;
    maximum?: number;
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
export declare function validateLength(model: Model, field: Field, value: unknown, options: LengthConstraintOptions): string | undefined;
export type EmailConstraintOptions = ConstraintOptions;
/**
 * Validates whether `value` contains a valid e-mail address.
 *
 * Will throw `InvalidValueForConstraintError` if `value` is not a string.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateEmail(model: Model, field: Field, value: unknown, options: EmailConstraintOptions): string | undefined;
/**
 * Contains a regular expression against which to match the provided value
 */
export interface FormatConstraintOptions extends ConstraintOptions {
    pattern: RegExp;
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
export declare function validateFormat(model: Model, field: Field, value: unknown, options: FormatConstraintOptions): string | undefined;
/**
 * Contains the name of the field against which the provided value
 * should be checked for identity
 */
export interface ConfirmationConstraintOptions extends ConstraintOptions {
    on: Field;
}
/**
 * Validates whether `value` is identical to `model[options.on]`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateConfirmation(model: Model, field: Field, value: unknown, options: ConfirmationConstraintOptions): string | undefined;
/**
 * Stores an array of elements allowed
 */
export interface InclusionConstraintOptions extends ConstraintOptions {
    in: unknown[];
}
/**
 * Validates whether `value` is included in `options.in`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateInclusion(model: Model, field: Field, value: unknown, options: InclusionConstraintOptions): string | undefined;
/**
 * Stores an array of elements disallowed
 */
export interface ExclusionConstraintOptions extends ConstraintOptions {
    from: unknown[];
}
/**
 * Validates whether `value` is not included in `options.from`
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateExclusion(model: Model, field: Field, value: unknown, options: ExclusionConstraintOptions): string | undefined;
export type UUIDConstraintOptions = ConstraintOptions;
/**
 * Validates whether `value` contains a valid UUID. Hyphens, periods and
 * whitespaces are ignored.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateUUID(model: Model, field: Field, value: unknown, options: UUIDConstraintOptions): string | undefined;
/**
 * Contains a user-provide validator function to be used in custom validations.
 */
export interface CustomConstraintOptions extends ConstraintOptions {
    with: ValidatorFunction<this>;
}
/**
 * Validates whether `value` satisfies the constraint defined by the
 * passed validator function.
 * @param model
 * @param field
 * @param value
 * @param options
 */
export declare function validateCustom<Options extends CustomConstraintOptions>(model: Model, field: Field, value: unknown, options: Options): import("./common.ts").ValidationResult;
//# sourceMappingURL=validators.d.ts.map