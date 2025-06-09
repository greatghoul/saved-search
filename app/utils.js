
/**
 * Retrieves the localized message for the given key using the Chrome i18n API.
 * If the message is not found, returns the key itself as a fallback.
 *
 * @param {string} key - The key for the localized message.
 * @returns {string} The localized message or the key if not found.
 */
export function i18n(key) {
  return chrome.i18n.getMessage(key) || key;
}

/**
 * Generates a time-based random token.
 * Combines current timestamp with random values for uniqueness.
 * Optionally adds a prefix to the token.
 * @param {string} [prefix] - Optional prefix for the token.
 * @returns {string} The generated token.
 */
export function createToken(prefix) {
  const timestamp = Date.now().toString();
  const random = Math.random().toString().substring(2, 10);
  const token = `${timestamp}-${random}`;
  return prefix ? `${prefix}-${token}` : token;
}
