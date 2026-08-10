function flattenObject(obj, result = {}) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, result);
    } else {
      result[key] = value; // override if key already exists
    }
  }
  return result;
}

export default flattenObject;
