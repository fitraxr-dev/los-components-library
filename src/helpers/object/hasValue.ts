import type { SectionFormatProperties } from '@syncfusion/ej2-react-documenteditor';

/**
 * Checks if an object has any properties (is not empty)
 *
 * @param {Object} obj - The object to check
 * @returns {boolean} Returns true if the object has at least one property, false otherwise
 *
 * @example
 * hasObjectProperties({}) // false
 * hasObjectProperties({ a: 1 }) // true
 * hasObjectProperties(null) // false
 * hasObjectProperties(undefined) // false
 */
export const hasObjectProperties = <T extends Record<string, unknown>>(
  obj: T | null | undefined
): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return Object.keys(obj).length > 0;
};

/**
 * Checks if a specific property exists in an object and has a truthy value
 *
 * @param {Object} obj - The object to check
 * @param {string} key - The property key to check
 * @returns {boolean} Returns true if the property exists and has a truthy value
 *
 * @example
 * hasPropertyValue({ a: 1 }, 'a') // true
 * hasPropertyValue({ a: 0 }, 'a') // false
 * hasPropertyValue({ a: null }, 'a') // false
 * hasPropertyValue({}, 'a') // false
 */
export const hasPropertyValue = <T extends Record<string, unknown>>(
  obj: T | null | undefined,
  key: keyof T
): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return key in obj && obj[key] !== null && obj[key] !== '';
};

/**
 * Checks if multiple properties exist in an object and have truthy values
 *
 * @param {Object} obj - The object to check
 * @param {string[]} keys - Array of property keys to check
 * @returns {boolean} Returns true if all specified properties exist and have truthy values
 *
 * @example
 * hasAllPropertyValues({ a: 1, b: 2 }, ['a', 'b']) // true
 * hasAllPropertyValues({ a: 1 }, ['a', 'b']) // false
 */
export const hasAllPropertyValues = <T extends Record<string, unknown>>(
  obj: T | null | undefined,
  keys: Array<keyof T>
): boolean => {
  if (!obj || typeof obj !== 'object' || keys.length === 0) {
    return false;
  }
  return keys.every((key) => hasPropertyValue(obj, key));
};

/**
 * Checks if at least one of the specified properties exists in an object and has a truthy value
 *
 * @param {Object} obj - The object to check
 * @param {string[]} keys - Array of property keys to check
 * @returns {boolean} Returns true if at least one specified property exists and has a truthy value
 *
 * @example
 * hasAnyPropertyValue({ a: 1 }, ['a', 'b']) // true
 * hasAnyPropertyValue({}, ['a', 'b']) // false
 */
export const hasAnyPropertyValue = <T extends Record<string, unknown>>(
  obj: T | null | undefined,
  keys: Array<keyof T>
): boolean => {
  if (!obj || typeof obj !== 'object' || keys.length === 0) {
    return false;
  }
  return keys.some((key) => hasPropertyValue(obj, key));
};

/**
 * Checks if initialSectionFormat has any meaningful values
 *
 * @param {SectionFormatProperties} initialSectionFormat - The section format properties to check
 * @returns {boolean} Returns true if initialSectionFormat has at least one property with a meaningful value
 *
 * @example
 * hasInitialSectionFormat({ pageWidth: 612 }) // true
 * hasInitialSectionFormat({}) // false
 * hasInitialSectionFormat(null) // false
 */
export const hasInitialSectionFormat = (
  initialSectionFormat: Partial<Record<keyof SectionFormatProperties, unknown>> | null | undefined
): boolean => {
  return hasObjectProperties(initialSectionFormat);
};
/**
 * Checks if the specified property exists and has a meaningful value in the section format properties.
 *
 * @param {SectionFormatProperties | null | undefined} initialSectionFormat - The section format properties to check
 * @param {keyof SectionFormatProperties} property - The property to check
 * @returns {boolean} Returns true if the specified property exists and has a meaningful value
 *
 * @example
 * hasSectionFormatProperty({ pageWidth: 612 }, 'pageWidth') // true
 * hasSectionFormatProperty({ pageWidth: 0 }, 'pageWidth') // false
 */
export const hasSectionFormatProperty = (
  initialSectionFormat: SectionFormatProperties | null | undefined,
  property: keyof SectionFormatProperties
): boolean => {
  return hasPropertyValue(
    initialSectionFormat as Record<string, unknown> | null | undefined,
    property as string
  );
};
