const CryptoJS = require("crypto-js")

export const encrypt_string = (value: string) => {
  return CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString();
}
export const decrypt_string = (value: string) => {
  return CryptoJS.AES.decrypt(value, process.env.ENCRYPTION_KEY).toString();
}
