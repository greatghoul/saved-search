
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
