import { decrypt_string,encrypt_string } from '../utils/strings';

export const authExternalApiServices = (
  request: any,
  response: any,
  next?: (err?: any) => any
) => {
  const format = process.env.API_M2M_FORMAT_REF;
  const apiCode = request.headers['X-SERVICE-API-KEY'];
  try {
    const hashingCode = decrypt_string(apiCode);

    const refHashingCode = format
        .replace(':CODE', encrypt_string(process.env.API_M2M_CODE))
        .replace(':SALT', process.env.SALT)
        .replace(':SECRET', process.env.SECRET)

    if (hashingCode === refHashingCode) {
      next();
    } else {
      throw new Error('unauthorized service access');
    }
  } catch (err) {
    next(err);
  }
};
