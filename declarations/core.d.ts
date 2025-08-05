import type { ConstraintOptions, Field, Model } from './common.ts';
export interface CoreOptions extends ConstraintOptions {
    if?(value: unknown, model: Model, field: Field): boolean | Promise<boolean>;
}
export type FieldValidationHaltBy = 'never' | 'first-error';
export type FieldConstraints = Record<string, CoreOptions>;
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
export declare function validateField(model: Model, field: Field, constraints: FieldConstraints, { haltBy }?: {
    haltBy?: FieldValidationHaltBy;
}): Promise<string[]>;
export type ModelValidationHaltBy = 'never' | 'first-error' | 'first-field-error';
export type ModelConstraints = Record<string, FieldConstraints>;
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
export declare function validate(model: Model, modelConstraints: ModelConstraints, { haltBy }?: {
    haltBy?: ModelValidationHaltBy;
}): Promise<Record<string, string[]>>;
//# sourceMappingURL=core.d.ts.map