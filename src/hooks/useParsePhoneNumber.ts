export function parsePhoneFields(input) {
  let result = {};
  // const [areaCode, ext, number] = input?.split('-') || [];
  const [areaCode, number, ext] = input?.split('-') || [];
  result = {
    areaCode: areaCode || '',
    ext: ext || null,
    number: number || '',
  };
  return result;
}

export function serializePhoneFields(input) {
  let result = '';
  const { areaCode = '', ext = null, number = '' } = input || {};
  // result = [areaCode, ext, number].join('-');
  result = [areaCode, number, ext].join('-');
  return result;
}
