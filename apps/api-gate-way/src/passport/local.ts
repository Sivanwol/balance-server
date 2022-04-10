import { Container } from 'typedi';
import { UsersService } from '@wolberg-pro-games/utils-server/services';
import { AuthService } from '../services';
const passport = require( 'passport' );

passport.serializeUser( ( user, done ) => {
  done( null, user );
} );
passport.deserializeUser( async ( id, done ) => {
  const userService = Container.get(UsersService);
  const matchingUser = await userService.findUserById( id )
  done( null, matchingUser );
} );
export const BindLocalAUth = () => {
  const localStrategy = require( 'passport-local' ).Strategy;
  passport.use(
    new localStrategy( {
        usernameField: 'userId',
        passwordField: 'password',
        session: false
      }, async ( userId, password, done ) => {
        try {
          const userService = Container.get(UsersService);
          const authService = Container.get(AuthService);
          const user = await authService.login( userId, password )

          return done( null, user );
        } catch (error) {
          done( error );
        }
      }
    )
  );

}
