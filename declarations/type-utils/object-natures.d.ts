/**
 * Contains all possible values of operator `typeof`
 */
export declare const TYPE_VALUES: readonly ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"];
/**
 * Defines a type enumerating possible values of operator `typeof`
 */
export type Type = (typeof TYPE_VALUES)[number];
/**
 * Defines a type that can contain any constructor function
 */
export type Constructor<T> = new (...args: never[]) => T;
//# sourceMappingURL=object-natures.d.ts.map