
/**
 * Checks if the given string contains a valid e-mail address.
 * @param value
 */
function isEmailValid(value) {
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return value.match(emailRegex) !== null;
}

export { isEmailValid };
//# sourceMappingURL=email-format.js.map
