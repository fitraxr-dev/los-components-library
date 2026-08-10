import { getCookie } from './cookie';

/**
 * Parses a string value and returns a normalized number by removing non-numeric characters.
 *
 * @param {string} val - The input string to be parsed.
 * @returns {string} - A normalized string containing only numeric characters.
 *
 * @example
 * // Returns "1234567"
 * const result = parseNumber("1,234,567.89");
 */
export const parseNumber = (inputString) => {
  const result = inputString?.replace(/[^0-9.]/g, '');
  return Number(result);
};

/**
 * Debouce a function without using useDebounce hook
 *
 * @param {func} func - Function to be debounced.
 * @param {number} timeout - Debounced timeout
 * @returns {void}
 *
 * @example
 * debounce(() => { console.log('debounced')}, 300));
 */
export const debounce = (func, timeout = 500) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => { func.apply(null, args); }, timeout);
  };
};

/**
 * Compares two objects for equality using JSON.stringify.
 *
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {boolean} Returns true if the objects are equal, false otherwise.
 *
 * @example
 * const objA = { a: 1, b: { c: 2, d: 3 } };
 * const objB = { a: 1, b: { c: 2, d: 3 } };
 * const objC = { a: 1, b: { c: 2, d: 4 } };
 *
 * console.log(objectsEqual(objA, objB)); // Output: true
 * console.log(objectsEqual(objA, objC)); // Output: false
 */
export const objectsEqual = (obj1, obj2) => {
  const stringifiedObj1 = JSON.stringify(obj1);
  const stringifiedObj2 = JSON.stringify(obj2);

  return stringifiedObj1 === stringifiedObj2;
};

/**
*
* @param {string} dataUrl  - Source url
* @param {string} filename - Filename
*
* @example
* downloadFile(http://exampleUrl.com, exampleFileName)
*/
export const downloadFile = async (dataUrl: string, filename: string) => {
  try {
    const blob = await fetch(dataUrl).then((r) => r.blob());
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error(error);
  }
};

/**
*
* @param {string} dataUrl  - Source url
*
* @example
* previewFile(http://exampleUrl.com)
*/
export const previewFile = async (dataUrl: string) => {
  try {
    const token = getCookie('token');
    const blob = await fetch(dataUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      method: 'GET',
    }).then((r) => r.blob());
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener,noreferrer';

    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error preview image: ', error);
  }
};

/**
*
* @param {string} dataUrl  - Source url
* @param {string} filename - Filename
*
* @example
* downloadFile(http://exampleUrl.com, exampleFileName)
*/
export const downloadFileV2 = async (dataUrl: string, filename: string, fileExtension: string = '') => {
  try {
    // const token = getCookie('token');
    // const response = await fetch(dataUrl, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   method: 'GET',
    // });
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Ensure the filename includes the desired extension
    const filenameWithExtension = fileExtension
      ? filename.endsWith(fileExtension)
        ? filename
        : `${filename}${fileExtension}`
      : filename;

    const link = document.createElement('a');
    link.href = url;
    link.download = filenameWithExtension;

    // Programmatically trigger a click event
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Release memory
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export const sumNominalValues = (nominalValue1: string, nominalValue2: string) => {
  try {
    const parsedValue1 = Number(nominalValue1?.replaceAll(',', ''));
    const parsedValue2 = Number(nominalValue2?.replaceAll(',', ''));

    if (isNaN(parsedValue1) || isNaN(parsedValue2)) return '';

    const nominal = parsedValue1 + parsedValue2;
    const formattedNominal = nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedNominal;
  } catch (error) {
    return '';
  }
};

export const multiplyNominalValues = (nominalValue1: string, nominalValue2: string) => {
  try {
    const parsedValue1 = Number(nominalValue1?.replaceAll(',', ''));
    const parsedValue2 = Number(nominalValue2?.replaceAll(',', ''));

    if (isNaN(parsedValue1) || isNaN(parsedValue2)) return '';

    const nominal = parsedValue1 * parsedValue2;
    const formattedNominal = nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedNominal;
  } catch (error) {
    return '';
  }
};

export const formatNumberToNominal = (nominal: string) => {
  return nominal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatNumber = (number: string) => {
  if (typeof number === 'string') {
    return number?.replaceAll(',', '');
  } else {
    return '';
  }
};

export const tanyaKeBackend = (val: string) => val ?? 'Tanya ke Mas Yono';

export const tanyaKeMasYono = (obj) => {
  const ignoreKeys = [
    'contents',
    'data',
    'description',
    'id',
    'status',
    'userGroup',
    'list',
    'listDebtorGroup',
    'listDocument',
    'listDocuments',
    'listDto',
    'listParameter',
    'listParameter',
    'listRole',
    'listUserGroup',
  ];
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null && !ignoreKeys.includes(key)) {
        obj[key] = 'Tanya ke Mas Yono';
      } else if (typeof obj[key] === 'object') {
        tanyaKeMasYono(obj[key]);
      }
    }
  }

  return obj;
};

export const capitalize = (str: string) => {
  if (str.length === 0) return str;
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const makeUID = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export const stringToNumber = (str: string) => {
  if (!str) return null;

  return Number(str);
};

export const downloadBinaryPdf = async (inputData, fileName) => {
  try {

    const blob = new Blob([inputData.data], { type: inputData.headers['content-type'] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
  }
};

export function extractPaths(array: any) {
  let paths = [];
  array.forEach((item) => {
    if (item.path) {
      paths.push(item.path);
    }
    if (item.subMenu) {
      paths = paths.concat(extractPaths(item.subMenu));
    }
  });
  return paths;
}
/**
 * convert Date string to be hours and minutes format
 *
 * @param {string | Date} date - The input date to be converted
 * @returns {string} A formatted date with hours:minutes format
 *
 * @example
 * const time = getHoursMinutes(new Date())
 * @returns {string} 09:20
 *
 * @example
 * const time = getHoursMinutes('2024-11-21T10:18:03.680+07:00')
 * @return {string} 10:18
 *
 * @example
 * const time = getHoursMinutes('2024-11-21T11:05:03.680+07:00')
 * @return {string} 11:05
 */

export const getHoursMinutes = (date: string | Date) => {
  const _date = new Date(date);
  const minutes = `${_date.getMinutes() < 10 ? '0' : ''}${_date.getMinutes()}`;
  const result = `${_date.getHours()}:${minutes}`;
  return result;
};
