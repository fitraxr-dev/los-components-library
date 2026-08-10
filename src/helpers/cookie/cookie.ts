import Cookies from 'js-cookie';

/**
 * Get a cookie
 * @param {string} key Cookie key
 * @returns {string} Value
 */
export function getCookie(key) {
  return Cookies.get(key);
}

/**
 * Set a cookie
 * @param {string} key Cookie key
 * @param {string} value Value to set
 * @param {Object} [options] Options
 * @returns {string} Value
 */
export function setCookie(key, value, options) {
  return Cookies.set(key, value, options);
}

/**
 * Get a cookie
 * @param {string} key Cookie key
 */
export function removeCookie(key) {
  return Cookies.remove(key);
}
