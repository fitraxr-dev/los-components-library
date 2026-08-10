export const encrypt = (plainText, secretKey) => {
  return plainText;
  // const encrypted = CryptoJS.AES.encrypt(plainText, secretKey);
  // return encrypted.toString();
};

export const decrypt = (ciphertext, secretKey) => {
  return ciphertext;
  // const decrypted = CryptoJS.AES.decrypt(ciphertext, secretKey);
  // return decrypted.toString(CryptoJS.enc.Utf8);
};
