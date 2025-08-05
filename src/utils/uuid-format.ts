const UUID_FORMAT = /^[0-9a-f]{12}[1-5][0-9a-f]{3}[89ab][0-9a-f]{15}$/i

/**
 * Checks whether a string contains a valid UUID.
 * Before testing, the value is stripped from dashes, periods and whitespaces.
 * @param value The string to be tested
 * @return Whether the provided string contains a valid UUID
 */
export function isUUIDValid(value: string) {
  const sanitised = value.replaceAll(/\s|-|\./g, '')
  return UUID_FORMAT.test(sanitised)
}
