/**
 * Adds an alpha channel (opacity) to a hexadecimal color code.
 *
 * @param {string} color - The hexadecimal color code (without alpha channel).
 * @param {number} [opacity=1] - The opacity value between 0 and 1. If not provided, defaults to 1 (fully opaque).
 * @returns {string} - The updated color with the alpha channel in hexadecimal format.
 */
export const addAlphaToHex = (color, opacity) => {
  const op = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + op.toString(16).toUpperCase();
};
