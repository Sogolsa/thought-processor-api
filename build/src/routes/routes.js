"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _thoughtControllers = require("../controllers/thoughtControllers");
var _userControllers = require("../controllers/userControllers");
var _passport = _interopRequireDefault(require("passport"));
var _auth = _interopRequireDefault(require("../../auth"));
var _expressValidator = require("express-validator");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var routes = function routes(app) {
  // Initialize the login route
  (0, _auth["default"])(app); // Call the loginRoute function and pass the app instance

  //users endpoint
  app.route('/logout').post(_passport["default"].authenticate('jwt', {
    session: false
  }), _userControllers.logoutUser);
  app.route('/users')
  // .get(passport.authenticate('jwt', { session: false }), getUsers)
  .post([
  // Validation logic to register user
  (0, _expressValidator.check)('userName', 'userName is required').isLength({
    min: 1
  }), (0, _expressValidator.check)('userName', 'userName contains non alphanumeric characters-not allowed.').isAlphanumeric(), (0, _expressValidator.check)('Password', 'Password is required').not().isEmpty(),
  // Is not empty
  (0, _expressValidator.check)('Email', 'Email does not appear to be valid.').isEmail()], _userControllers.registerUser);
  app.route('/users/:userId').put(_passport["default"].authenticate('jwt', {
    session: false
  }), [
  // Validation logic to update
  (0, _expressValidator.check)('userName').isLength({
    min: 1
  }) // Ensure userName is at least 4 characters
  .withMessage('userName must be at least 4 characters long.').isAlphanumeric().withMessage('userName contains non-alphanumeric characters - not allowed.'), (0, _expressValidator.check)('Password').isLength({
    min: 6
  }) // Ensure Password is at least 6 characters
  .withMessage('Password must be at least 6 characters long.').not().isEmpty().withMessage('Password is required.'), (0, _expressValidator.check)('Email').optional() // Email is optional
  .isEmail().withMessage('Email does not appear to be valid.')], function (req, res, next) {
    var errors = (0, _expressValidator.validationResult)(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    next(); // Proceed to updateUser if validation passed
  }, _userControllers.updateUser)["delete"](_passport["default"].authenticate('jwt', {
    session: false
  }), _userControllers.deleteUser);
  app.route('/thoughts').post(_passport["default"].authenticate('jwt', {
    session: false
  }), _thoughtControllers.addNewThought).get(_passport["default"].authenticate('jwt', {
    session: false
  }), _thoughtControllers.getOwnThoughts);
  app.route('/thoughts/:thoughtId')
  // .get(passport.authenticate('jwt', { session: false }), getThoughtByName)
  .put(_passport["default"].authenticate('jwt', {
    session: false
  }), _thoughtControllers.updateThought)["delete"](_passport["default"].authenticate('jwt', {
    session: false
  }), _thoughtControllers.deleteThought);
};
var _default = exports["default"] = routes;
//# sourceMappingURL=routes.js.map