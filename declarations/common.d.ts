/**
 * Defines what type of field designators we accept.
 * This all should be accepted in bracket notation independently
 * of the underlying model.
 */
export type Field = string | symbol;
/**
 * Defines the type of model that can be validated, i.e. objects
 */
export type Model = Record<Field, unknown>;
/**
 * Contains the data that is always present on translation
 * options and can be used in all translations.
 * These translations are always invoked upon a failing constraint.
 */
export interface I18nTranslationOptions {
    /**
     * The name of the failed constraint
     */
    constraint: string;
    /**
     * THe model that failed the constraint
     */
    model: Model;
    /**
     * The name of the field that failed the constraint
     */
    field: Field;
    /**
     * The value of the field that failed the constraint
     */
    value: unknown;
}
/**
 * Minimal interface to work with internationalisation.
 * This mimics `ember-intl`'s API, so it is pretty much
 * plug-and-play.
 */
export interface I18nHandler {
    /**
     * Checks whether an error key is recognised by the underlying
     * internationalisation engine
     * @param errorKey The key under which a translation might be
     * available
     * @see messageForError
     */
    exists(errorKey: string): boolean;
    /**
     * Fetches a translation from the internationalisation engine
     * and returns it.
     * @param errorKey The error key associated with the desired
     * error message
     * @param options An object with some information about the
     * failed constraint context, along with failed validation
     * options.
     * @see I18nTranslationOptions
     */
    t<Options extends I18nTranslationOptions>(errorKey: string, options: Options): string;
}
/**
 * Base interface for constraint options passed to validators to
 * configure their behaviour.
 * These options are also used on error handling when a constraint
 * is not met.
 * @see messageForError
 */
export interface ConstraintOptions {
    /**
     * A custom message that will always be returned on a failing
     * constraint, taking precedence over others
     */
    message?: string;
    /**
     * Stores options to interact with an underlying internationalisation
     * engine.
     */
    i18n?: {
        /**
         * An interface of the internationalisation engine used to
         * translate error messages if present.
         * This mimics `ember-intl`'s interface, so the service can be
         * directly provided as this property.
         */
        handler: I18nHandler;
        /**
         * An arbitrary key to be provided to the internationalisation
         * engine, if present, to fetch a specific translation.
         * @see I18nHandler.t
         */
        key?: string;
    };
}
/**
 * Defines the type that validator functions must return.
 */
export type ValidationResult = string | Promise<string | void> | void;
/**
 * Defines the signature common to all validation functions.
 */
export type ValidatorFunction<Options extends ConstraintOptions> = {
    (model: Model, field: Field, value: unknown, options: Options): ValidationResult;
};
//# sourceMappingURL=common.d.ts.map