import passport from "passport";

// Local Strategy for logging in
import { Strategy as LocalStrategy } from "passport-local";
// JWTStrategy For Verifying JWT in Subsequent Requests after logging in
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import models from "./src/models/models";
const { User } = models;

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Passport Local Strategy for user authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "Email",
      passwordField: "Password",
    },
    async (email, password, done) => {
      await User.findOne({ Email: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            console.log("Incorrect userName.");
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          if (!user.validatePassword(password)) {
            console.log("Incorrect password");
            return done(null, false, { message: "Incorrect Password." });
          }
          console.log("finished");
          return done(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return done(error);
          }
        });
    }
  )
);

const opts = {
  // Extract JWT from Authorization header as a Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

// Validate SECRET_KEY environment variable
if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

// Jwt Strategy for verifying subsequent requests after logging in
passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    return await User.findById(jwtPayload._id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
      });
  })
);
