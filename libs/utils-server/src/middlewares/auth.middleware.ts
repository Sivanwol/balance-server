import expressjwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import jwtAuthz from "express-jwt-authz";
import * as jwt from 'jsonwebtoken'
export const checkAuthRoute = expressjwt({
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

const client = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(error, key:any) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export async function isAuthTokenValidGQL(token): Promise<{
  error?: any,
  decoded?: any
}> {
  if (token) {
    const bearerToken = token.split(" ");

    const result = new Promise((resolve, reject) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"]
        },
        (error, decoded) => {
          if (error) {
            resolve({ error });
          }
          if (decoded) {
            resolve({ decoded });
          }
        }
      );
    });

    return result;
  }

  return { error: "No token provided" };
}
