import exprressJwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import jwtAuthz from "express-jwt-authz";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { decrypt_string, encrypt_string } from '../utils/strings';

export const checkAuth = exprressJwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS
  }),

  // Validate the audience and the issuer
  audience: process.env.AUTH0_Audience, //replace with your API's audience, available at Dashboard > APIs
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: [ 'RS256' ]
});

export const checkPermissions = (permissions: string | string[]) => {
  return jwtAuthz([...permissions], {
    customScopeKey: "permissions",
    checkAllScopes: true,
    failWithError: true
  });
};

export class ExternalServicesChecks implements ExpressMiddlewareInterface {
  // interface implementation is optional

  use(request: any, response: any, next?: (err?: any) => any): any {
    const format = process.env.API_M2M_FORMAT_REF;
    const apiCode = request.headers['X-SERVICE-API-KEY'];
    try {
      const hashingCode = encrypt_string(format.replace(':CODE', apiCode).replace(':SALT', process.env.SALT).replace(':SECRET', process.env.SECRET))
      const refHashingCode = encrypt_string(format.replace(':CODE', process.env.API_M2M_CODE).replace(':SALT', process.env.SALT).replace(':SECRET', process.env.SECRET))
      if (hashingCode ===  refHashingCode){
        next();
      } else {
        throw new Error('unauthrized service access')
      }
    } catch (err) {
      next(err)
    }
  }
}
