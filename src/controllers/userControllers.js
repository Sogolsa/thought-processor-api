import mongoose from 'mongoose';
import models from '../models/models';
const { User } = models;

import { validationResult } from 'express-validator';

export const registerUser = async (req, res) => {
  // Check validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = User.hashPassword(req.body.Password);
  await User.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + ' already exists!');
      } else {
        User.create({
          userName: req.body.userName,
          Password: hashedPassword,
          Email: req.body.Email,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .send('Error occurred when creating the user', error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Something went wrong: ' + error);
    });
};

// get the list of all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).send('There was an error fetching users.');
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res
        .status(404)
        .send('User not found or you do not have permission to update it.');
    }

    if (req.body.userName) {
      user.userName = req.body.userName;
    }
    if (req.body.Password) {
      const hashedPassword = User.hashPassword(req.body.Password); // Hash the new password
      user.Password = hashedPassword; // Set the hashed password
    }
    if (req.body.Email) {
      user.Email = req.body.Email;
    }

    const updatedUser = await user.save();
    return res.status(201).json(updatedUser);
  } catch (err) {
    return res
      .status(500)
      .send('There was an error updating the user information.');
  }
};

export const deleteUser = async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .send(requestAnimationFrame.params.userId + ' was not deleted.');
      } else {
        res.status(200).send(req.params.userId + ' was deleted.');
      }
    })
    .catch((error) => {
      res.status(500).send('Something went wrong.', error);
    });
};

export const logoutUser = (req, res) => {
  res
    .status(200)
    .send(
      'Successfully logged out. Please remove the token on the client side.'
    );
};
