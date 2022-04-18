import exprressJwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import jwt from 'jsonwebtoken';

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


export async function AuthMiddleware(token: string, roles: string[]): Promise<boolean> {
  if (!token) return false;

  // Extracts the bearer token from the request headers
  const bearerToken = token.split(' ')[1];

  // Set up a JWKS client that retrieves the public key from Auth0, this public key will be used to challenge the
  // bearer token against.
  const client = jwksRsa({
      jwksUri: process.env.AUTH0_JWKS // For example, using Auth0 you can find this in Auth0 Applications -> Advanced Settings -> Endpoints. This should look something like this: https://yourtenant.eu.auth0.com/.well-known/jwks.json
  });
  const getPublicKey = (header: any, callback: any) => {
      client.getSigningKey(header.kid, (err, key) => {
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
      });
  }

  // As jwt.verify cannot be awaited, we construct a promise that we will resolve once the JWT verification has
  // finished. This way, we can simulate awaiting of the JWT verification.
  let jwtVerifyPromiseResolver: (tokenValid: boolean) => void;
  const jwtVerifyPromise = new Promise<boolean>(resolve => {
      jwtVerifyPromiseResolver = resolve;
  });

  const tokenNamespace = 'your_namespace'; // The namespace you have added to the roles in your auth token in an Auth0 rule

  jwt.verify(bearerToken, getPublicKey, {}, (err, decodedJwt: any) => {
      let jwtValid = false;

      if (err)
          jwtValid = false;
      else {
          // When the requested endpoint requires roles, check if the decoded JWT contains those roles
          if (roles && roles.length > 0) {
              const userRoles = decodedJwt[`${tokenNamespace}roles`];

              if (userRoles)
                  // Token is valid if all roles for request are present in the user's roles
                  jwtValid = roles.every((role) => userRoles.includes(role));
              else
                  // Token does not contain roles, mark token as invalid
                  jwtValid = false;
          }

          jwtValid = true;
      }

      jwtVerifyPromiseResolver(
          jwtValid
      );
  });

  return jwtVerifyPromise;
}
