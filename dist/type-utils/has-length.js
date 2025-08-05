
/**
 * Checks whether a value has a numeric `length` property
 * @param value
 */
function hasLength(value) {
  return typeof value === 'string' || typeof value === 'object' && value !== null && 'length' in value && typeof value.length === 'number';
}

export { hasLength };
//# sourceMappingURL=has-length.js.map
