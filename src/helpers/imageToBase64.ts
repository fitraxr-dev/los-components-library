/**
 * Converts a Blob to a base64 string.
 *
 * @param {Blob} blob The Blob to convert to base64.
 * @returns {Promise<string>} A promise that resolves to the base64 string of the Blob.
 */
const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};


export default blobToBase64;
