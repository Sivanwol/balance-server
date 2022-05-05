import crypto from 'crypto';
export const authExternalApiServices = (
  request: any,
  response: any,
  next?: (err?: any) => any
) => {
  const format = process.env.API_M2M_FORMAT_REF;
  const hash = crypto.createHmac('sha512', process.env.ENCRYPTION_KEY);
  const apiCode = request.headers['x-service-api-key'];
  try {
    const refHashingCode = hash.update(format
      .replace(':CODE', process.env.API_M2M_CODE)
      .replace(':SALT', process.env.SALT)
      .replace(':SECRET', process.env.SECRET), 'utf-8');

    if (apiCode === refHashingCode.digest('hex')) {
      next();
    } else {
      throw new Error('unauthorized service access');
    }
  } catch (err) {
    next(err);
  }
};
