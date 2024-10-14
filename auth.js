import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Router } from 'express';

import './passport';

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
      if (error || !user) {
        return res.status(400).json({
          message: 'Something went wrong',
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
