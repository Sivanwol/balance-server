const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config();
const format = process.env.API_M2M_FORMAT_REF;
const hash = crypto.createHmac('sha512', process.env.ENCRYPTION_KEY);
const data = hash.update(format
  .replace(':CODE', process.env.API_M2M_CODE)
  .replace(':SALT', process.env.SALT)
  .replace(':SECRET', process.env.SECRET), 'utf-8');
//Creating the hash in the required format
console.log(data.digest('hex'));
