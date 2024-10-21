"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSchema = exports.thoughtSchema = exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Schema = _mongoose["default"].Schema;
var thoughtSchema = exports.thoughtSchema = new Schema({
  thoughtName: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: false
  },
  Emotions: {
    type: [String]
  },
  Problems: {
    type: [String]
  },
  possibleSolutions: {
    type: [String]
  },
  Affirmation: {
    type: String
  },
  User: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  },
  created_date: {
    type: Date,
    "default": Date.now
  }
});
var userSchema = exports.userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Thoughts: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Thought'
  }]
});

// Adding hashPassword function for hashing passwords
userSchema.statics.hashPassword = function (password) {
  return _bcrypt["default"].hashSync(password, 10);
};

// Adding validatePassword to compare hashed passwords
userSchema.methods.validatePassword = function (password) {
  return _bcrypt["default"].compareSync(password, this.Password);
};

// Creating the models
var Thought = _mongoose["default"].model('Thought', thoughtSchema);
var User = _mongoose["default"].model('User', userSchema);
var _default = exports["default"] = {
  Thought: Thought,
  User: User
};
//# sourceMappingURL=models.js.map