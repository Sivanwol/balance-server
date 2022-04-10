import { Container } from 'typedi';
import { UsersService } from '@wolberg-pro-games/utils-server/services';

export const BindJWTAUth = () => {
  const passport = require( 'passport' );
  const JwtStrategy = require( 'passport-jwt' ).Strategy,
        ExtractJwt  = require( 'passport-jwt' ).ExtractJwt;
  const opts = {
    secretOrKey: process.env.SECRET,
    issuer: process.env.ISSUER,
    audience: process.env.Audience,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }
  passport.use( new JwtStrategy( opts, async function ( jwt_payload, done ) {
    const userService = Container.get(UsersService);
    try {
      const locateUser = await userService.findUserById( jwt_payload.user_id );
      if (!locateUser) return done( null, false );

      return done( null, locateUser );
    } catch (err) {
      return done( err, false );
    }
  } ) );
}
