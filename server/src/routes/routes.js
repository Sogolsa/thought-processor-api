import {
  addNewThought,
  getOwnThoughts,
  updateThought,
  deleteThought,
  getThoughtById,
} from '../controllers/thoughtControllers';

import {
  registerUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  logoutUser,
} from '../controllers/userControllers';

import passport from 'passport';
import loginRoute from '../../auth';
import { check, validationResult } from 'express-validator';

const routes = (app) => {
  // Initialize the login route
  loginRoute(app); // Call the loginRoute function and pass the app instance

  //users endpoint
  app
    .route('/logout')
    .post(passport.authenticate('jwt', { session: false }), logoutUser);
  app
    .route('/users')
    // .get(passport.authenticate('jwt', { session: false }), getUsers)
    .post(
      [
        // Validation logic to register user
        check('userName', 'userName is required').isLength({ min: 1 }),
        check(
          'userName',
          'userName contains non alphanumeric characters-not allowed.'
        ).isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(), // Is not empty
        check('Email', 'Email does not appear to be valid.').isEmail(),
      ],
      registerUser
    );

  app
    .route('/users/:userId')
    .get(passport.authenticate('jwt', { session: false }), getUserById)
    .put(
      passport.authenticate('jwt', { session: false }),
      [
        // Validation logic to update
        check('userName')
          .isLength({ min: 1 }) // Ensure userName is at least 4 characters
          .withMessage('userName must be at least 4 characters long.')
          .isAlphanumeric()
          .withMessage(
            'userName contains non-alphanumeric characters - not allowed.'
          ),
        check('Password')
          .isLength({ min: 6 }) // Ensure Password is at least 6 characters
          .withMessage('Password must be at least 6 characters long.')
          .not()
          .isEmpty()
          .withMessage('Password is required.'),
        check('Email')
          .optional() // Email is optional
          .isEmail()
          .withMessage('Email does not appear to be valid.'),
      ],
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        next(); // Proceed to updateUser if validation passed
      },
      updateUser
    )
    .delete(passport.authenticate('jwt', { session: false }), deleteUser);

  app
    .route('/thoughts')
    .post(passport.authenticate('jwt', { session: false }), addNewThought)
    .get(passport.authenticate('jwt', { session: false }), getOwnThoughts);

  app
    .route('/thoughts/:thoughtId')
    .get(passport.authenticate('jwt', { session: false }), getThoughtById)
    .put(passport.authenticate('jwt', { session: false }), updateThought)
    .delete(passport.authenticate('jwt', { session: false }), deleteThought);

  console.log('Routes registered.');
};

export default routes;
