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

export const deleteUser = async (req, res) => {
  await User.findOneAndDelete({ userName: req.params.userName })
    .then((user) => {
      if (!user) {
        res.status(400).send(res.params.userName + ' was not deleted.');
      } else {
        res.status(200).send(res.params.userName + ' was deleted.');
      }
    })
    .catch((error) => {
      res.status(500).send('Something went wrong.', error);
    });
};
