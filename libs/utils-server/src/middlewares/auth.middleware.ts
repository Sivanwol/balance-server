import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";


export const checkJwt = jwt({
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
