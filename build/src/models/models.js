"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSchema = exports.thoughtSchema = exports.gratitudeSchema = exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _encryption = require("../utils/encryption");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var Schema = _mongoose["default"].Schema;

/*
 * Creating the schemas for Thought model
 */
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
    ref: "User",
    required: true
  },
  created_date: {
    type: Date,
    "default": Date.now
  }
});

// Encrypt sensitive fields before saving with pre save middleware
thoughtSchema.pre("save", function (next) {
  if (this.thoughtName && !this.thoughtName.includes("|")) {
    this.thoughtName = (0, _encryption.encrypt)(this.thoughtName);
  }
  if (this.Description && !this.Description.includes("|")) {
    this.Description = (0, _encryption.encrypt)(this.Description); // Encrypt Description
  }
  if (this.Emotions && Array.isArray(this.Emotions)) {
    this.Emotions = this.Emotions.map(function (emotion) {
      if (emotion && !emotion.includes("|")) {
        return (0, _encryption.encrypt)(emotion); // Encrypt if it's not encrypted yet
      }
      return emotion;
    }); // Encrypt each emotion
  }
  if (this.Problems && Array.isArray(this.Problems) && !this.Problems.includes("|")) {
    this.Problems = this.Problems.map(function (problem) {
      if (problem && !problem.includes("|")) {
        return (0, _encryption.encrypt)(problem); // Encrypt if it's not encrypted yet
      }
      return problem;
    });
  }
  if (this.possibleSolutions && Array.isArray(this.possibleSolutions) && !this.possibleSolutions.includes("|")) {
    this.possibleSolutions = this.possibleSolutions.map(function (solution) {
      if (solution && !solution.includes("|")) {
        return (0, _encryption.encrypt)(solution); // Encrypt if it's not encrypted yet
      }
      return solution;
    });
  }
  if (this.Affirmation && !this.Affirmation.includes("|")) {
    this.Affirmation = (0, _encryption.encrypt)(this.Affirmation); // Encrypt Affirmation
  }
  next();
});

// Decrypt sensitive fields after fetching from the database
thoughtSchema.methods.toJSON = function () {
  var thought = this.toObject(); // convert a Mongoose document into a plain JavaScript object

  if (thought.thoughtName) {
    thought.thoughtName = (0, _encryption.decrypt)(thought.thoughtName); // Decrypt thoughtName
  }
  if (thought.Description) {
    thought.Description = (0, _encryption.decrypt)(thought.Description); // Decrypt Description
  }
  if (thought.Emotions && thought.Emotions.length > 0) {
    thought.Emotions = thought.Emotions.map(function (emotion) {
      return (0, _encryption.decrypt)(emotion);
    }); // Decrypt each emotion
  }
  if (thought.Problems && thought.Problems.length > 0) {
    thought.Problems = thought.Problems.map(function (problem) {
      return (0, _encryption.decrypt)(problem);
    }); // Decrypt each problem
  }
  if (thought.possibleSolutions && thought.possibleSolutions.length > 0) {
    thought.possibleSolutions = thought.possibleSolutions.map(function (solution) {
      return (0, _encryption.decrypt)(solution);
    }); // Decrypt each possible solution
  }
  if (thought.Affirmation) {
    thought.Affirmation = (0, _encryption.decrypt)(thought.Affirmation); // Decrypt Affirmation
  }
  return thought;
};

/**
 * Creating the schema for gratefulness model
 */
var gratitudeSchema = exports.gratitudeSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: false
  },
  User: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  created_date: {
    type: Date,
    "default": Date.now
  }
});

// Encrypt before saving
gratitudeSchema.pre("save", function (next) {
  if (this.message && !this.message.includes("|")) {
    this.message = (0, _encryption.encrypt)(this.message);
  }
  if (this.details && !this.details.includes("|")) {
    this.details = (0, _encryption.encrypt)(this.details);
  }
  next();
});

// Decrypt before returning
gratitudeSchema.methods.toJSON = function () {
  var item = this.toObject();
  if (item.message) {
    item.message = (0, _encryption.decrypt)(item.message);
  }
  if (item.details) {
    item.details = (0, _encryption.decrypt)(item.details);
  }
  return item;
};

/**
 * Creating the schemas for User model
 * */
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
    ref: "Thought"
  }],
  Gratitudes: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Gratitude"
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
var Thought = _mongoose["default"].model("Thought", thoughtSchema);
var User = _mongoose["default"].model("User", userSchema);
var Gratitude = _mongoose["default"].model("Gratitude", gratitudeSchema);
var _default = exports["default"] = {
  Thought: Thought,
  User: User,
  Gratitude: Gratitude
};
//# sourceMappingURL=models.js.map