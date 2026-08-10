/**
 * Replaces placeholders in a path string with corresponding values from a query object.
 * @example
 * replacePath('/users/[userId]/profile', { userId: 999 });
 * // return '/users/999/profile'
 *
 * @param {string} path - The path containing placeholders in the format [placeholder].
 * @param {Object} query - The object containing key-value pairs to replace the placeholders.
 * @returns {string} - The updated path string with replaced values.
 */
export const replacePath = (path: string, query: Object) => {
  return path?.replace(
    /\[(\w+)\]/g,
    (_, queryName) => query[queryName] || '',
  );
};

/**
 * Removes trailing slashes from a string.
 * @param {string} str - The string to process.
 * @returns {string} - The string without trailing slashes.
 */
export const removeTrailingSlash = (str) => {
  return str?.replace(/\/+$/, '');
};

/**
 * Checks if a given path matches another path based on specific rules.
 * @param {string} asPath - The first path to compare.
 * @param {string} pathname - The second path to compare against the first path.
 * @returns {boolean} - Returns true if the paths match based on defined rules, otherwise false.
 */
export const matchesPathname = (asPath: string, pathname: string) => {
  if (asPath === pathname) {
    return true;
  }
  const baseAsPath = removeTrailingSlash(asPath?.split('?')[0]);
  const basePathname = removeTrailingSlash(pathname?.split('?')[0]);
  if (baseAsPath === basePathname) {
    return true;
  }
  const basePathRegex = new RegExp(
    `^${basePathname?.replace(
      /(\[[a-zA-Z0-9-]+\])+/g,
      '[a-zA-Z0-9-]+',
    )}$`.replace(/\[\.\.\.[a-zA-Z0-9-]+\]/g, '.*'),
  );
  if (basePathRegex.test(baseAsPath)) {
    return true;
  }
  return false;
};

/**
 * Gets the last part of a path string.
 * @param {string} path - The input path string.
 * @returns {string} The last part of the path.
 *
 * @example
 * const path = '/mip/1/customer-information';
 * getLastPath(path); // customer-information
 */
export const getLastPath = (path: string) => {
  if (!path) return;
  const arr = path.split('/');
  const result = arr[arr.length - 1];
  return result;
};

/**
 * Gets the last part of a path string.
 * @param {string} path - The input path string.
 * @returns {string} The last part of the path.
 *
 * @example
 * const path = '/mip/1/customer-information';
 * getFirstPath(path); // mip
 */
export const getFirstPath = (path: string) => {
  if (!path) return;
  const arr = path.split('/');
  const result = arr[1];
  return result;
};
