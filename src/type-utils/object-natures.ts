/**
 * Contains all possible values of operator `typeof`
 */
export const TYPE_VALUES =
  [ 'bigint', 'boolean', 'function', 'number', 'object', 'string', 'symbol', 'undefined' ] as const

/**
 * Defines a type enumerating possible values of operator `typeof`
 */
export type Type = typeof TYPE_VALUES[number]

/**
 * Defines a type that can contain any constructor function
 */
export type Constructor<T> = new(...args: never[]) => T
