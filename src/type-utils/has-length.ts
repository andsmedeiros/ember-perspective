/**
 * Checks whether a value has a numeric `length` property
 * @param value
 */
export function hasLength(value: unknown): value is { length: number } {
  return (
    typeof value === 'string' ||
    (typeof value === 'object' &&
      value !== null &&
      'length' in value &&
      typeof value.length === 'number')
  )
}
