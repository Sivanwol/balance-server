const CryptoJS = require("crypto-js")
const dotenv = require('dotenv')

dotenv.config();
const encrypt_string = (value) => {
  return CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString();
}
const format = process.env.API_M2M_FORMAT_REF;
console.log(encrypt_string(format
    .replace(':CODE', encrypt_string(process.env.API_M2M_CODE))
    .replace(':SALT', process.env.SALT)
    .replace(':SECRET', process.env.SECRET)));
