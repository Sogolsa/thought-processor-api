import {
  addNewThought,
  getOwnThoughts,
  getThoughtByName,
  updateThought,
  deleteThought,
} from '../controllers/thoughtControllers';
import {
  registerUser,
  deleteUser,
  getUsers,
} from '../controllers/userControllers';
import passport from 'passport';
import loginRoute from '../../auth';
import { check } from 'express-validator';

const routes = (app) => {
  // Initialize the login route
  loginRoute(app); // Call the loginRoute function and pass the app instance

  //users endpoint
  app
    .route('/users')
    .get(passport.authenticate('jwt', { session: false }), getUsers)
    .post(
      [
        // Validation logic to register user
        check('userName', 'userName is required').isLength({ min: 4 }), //Minimum value of 5 character only is allowed
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
    .route('/users/:userName')
    .get((req, res) => res.send('GET request successful'))
    .put((req, res) => res.send('PUT request successful.'))
    .delete(passport.authenticate('jwt', { session: false }, deleteUser));

  app
    .route('/thoughts')
    .post(passport.authenticate('jwt', { session: false }), addNewThought)
    .get(passport.authenticate('jwt', { session: false }), getOwnThoughts);
  app
    .route('/thoughts/:thoughtId')
    // .get(passport.authenticate('jwt', { session: false }), getThoughtByName)
    .put(passport.authenticate('jwt', { session: false }), updateThought)
    .delete(passport.authenticate('jwt', { session: false }), deleteThought);
  app
    .route('users/:userName/thoughts/:thoughtId')
    .post(passport.authenticate('jwt', { session: false }));
};

export default routes;
