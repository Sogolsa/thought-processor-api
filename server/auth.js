import jwt from 'jsonwebtoken';
import passport from 'passport';

import './passport';

import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

// jwt secret key
const jwtSecret = process.env.JWT_SECRET;

// Generates a JWT for the authenticated user.
const generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.userName,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

const loginRoute = (router) => {
  router.post('/login', async (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error) {
        console.error('Authentication Error:', error); // Log full error
        return res.status(400).json({
          message: 'An error occurred during authentication.',
          error,
        });
      }
      if (!user) {
        return res.status(400).json({
          message: info.message || 'Something went wrong.',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(400).json('login error: ' + error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

export default loginRoute;
