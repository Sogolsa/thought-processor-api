import passport from 'passport';

// Local Strategy for logging in
import { Strategy as LocalStrategy } from 'passport-local';
// JWTStrategy For Verifying JWT in Subsequent Requests after logging in
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from './src/models/models';

let Users = User;

// Passport Local Strategy for user authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'userName',
      passwordField: 'password',
    },
    async (userName, password, done) => {
      try {
        const user = await Users.fineOne({ userName: username });
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password!',
          });
        }
        if (!user.validatePassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        // Authentication success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const opts = {
  // Extract JWT from Authorization header as a Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};
// Jwt Strategy for verifying subsequent requests after logging in
passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      // Find the user specified in the token's payload
      const user = await Users.findById(jwtPayload._id);
      if (user) {
        // If user is found, return the user object
        return done(null, user);
      } else {
        // If user is not found, return false (unauthenticated)
        return done(null, false);
      }
    } catch (error) {
      return error, false;
    }
  })
);
