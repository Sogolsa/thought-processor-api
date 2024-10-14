import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

export const thoughtSchema = new Schema({
  thoughtName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
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
    ref: 'User',
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

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
      ref: 'Thought',
    },
  ],
});

// Adding hashPassword function for hashing passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Adding validatePassword to compare hashed passwords
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Creating the models
const Thought = mongoose.model('Thought', thoughtSchema);
const User = mongoose.model('User', userSchema);

export default { Thought, User };
