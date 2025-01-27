import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { encrypt, decrypt } from "../utils/encryption";

const Schema = mongoose.Schema;

export const thoughtSchema = new Schema({
  thoughtName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  Emotions: {
    type: [String],
  },
  Problems: {
    type: [String],
  },
  possibleSolutions: {
    type: [String],
  },
  Affirmation: {
    type: String,
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt sensitive fields before saving with pre save middleware
thoughtSchema.pre("save", function (next) {
  if (this.thoughtName && !this.thoughtName.includes("|")) {
    this.thoughtName = encrypt(this.thoughtName);
  }

  if (this.Description && !this.Description.includes("|")) {
    this.Description = encrypt(this.Description); // Encrypt Description
  }

  if (this.Emotions && Array.isArray(this.Emotions)) {
    this.Emotions = this.Emotions.map((emotion) => {
      if (emotion && !emotion.includes("|")) {
        return encrypt(emotion); // Encrypt if it's not encrypted yet
      }
      return emotion;
    }); // Encrypt each emotion
  }

  if (
    this.Problems &&
    Array.isArray(this.Problems) &&
    !this.Problems.includes("|")
  ) {
    this.Problems = this.Problems.map((problem) => {
      if (problem && !problem.includes("|")) {
        return encrypt(problem); // Encrypt if it's not encrypted yet
      }
      return problem;
    });
  }

  if (
    this.possibleSolutions &&
    Array.isArray(this.possibleSolutions) &&
    !this.possibleSolutions.includes("|")
  ) {
    this.possibleSolutions = this.possibleSolutions.map((solution) => {
      if (solution && !solution.includes("|")) {
        return encrypt(solution); // Encrypt if it's not encrypted yet
      }
      return solution;
    });
  }
  if (this.Affirmation && !this.Affirmation.includes("|")) {
    this.Affirmation = encrypt(this.Affirmation); // Encrypt Affirmation
  }
  next();
});

// Decrypt sensitive fields after fetching from the database
thoughtSchema.methods.toJSON = function () {
  const thought = this.toObject(); // convert a Mongoose document into a plain JavaScript object

  if (thought.thoughtName) {
    thought.thoughtName = decrypt(thought.thoughtName); // Decrypt thoughtName
  }

  if (thought.Description) {
    thought.Description = decrypt(thought.Description); // Decrypt Description
  }
  if (thought.Emotions && thought.Emotions.length > 0) {
    thought.Emotions = thought.Emotions.map((emotion) => decrypt(emotion)); // Decrypt each emotion
  }
  if (thought.Problems && thought.Problems.length > 0) {
    thought.Problems = thought.Problems.map((problem) => decrypt(problem)); // Decrypt each problem
  }
  if (thought.possibleSolutions && thought.possibleSolutions.length > 0) {
    thought.possibleSolutions = thought.possibleSolutions.map((solution) =>
      decrypt(solution)
    ); // Decrypt each possible solution
  }
  if (thought.Affirmation) {
    thought.Affirmation = decrypt(thought.Affirmation); // Decrypt Affirmation
  }

  return thought;
};

export const userSchema = new Schema({
  userName: { type: String, required: true },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thought",
    },
  ],
});

// Adding hashPassword function for hashing passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Adding validatePassword to compare hashed passwords
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Creating the models
const Thought = mongoose.model("Thought", thoughtSchema);
const User = mongoose.model("User", userSchema);

export default { Thought, User };
