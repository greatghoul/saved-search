
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

/**
 * Formats the given date as "Today", "1 Day Ago", "2 Days Ago", ..., "1 Week Ago".
 * Dates older than 7 days are shown as "1 Week Ago".
 * @param {Date|string|number} date - The date to format.
 * @returns {string} The formatted string.
 */
export function daysAgo(date) {
  const now = new Date();
  const d = new Date(date);
  // Calculate difference in days
  const diffTime = now.setHours(0,0,0,0) - d.setHours(0,0,0,0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 Day Ago';
  if (diffDays < 7) return `${diffDays} Days Ago`;
  return '1 Week Ago';
}

/**
 * Formats the given date as a localized full date and time string.
 * @param {Date|string|number} date - The date to format.
 * @returns {string} The formatted local date and time string.
 */
export function formatLocalDateTime(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleString();
}