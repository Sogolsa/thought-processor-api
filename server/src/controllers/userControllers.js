import mongoose from "mongoose";
import models from "../models/models";
const { User } = models;
const { Thought } = models;

import { check, validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  // Check validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // hash the password
    let hashedPassword = User.hashPassword(req.body.Password);

    // Check if the userName already exists
    const existingUserName = await User.findOne({
      userName: req.body.userName,
    });

    if (existingUserName) {
      console.log("Username already exists triggered for:", req.body.userName);

      return res.status(409).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ Email: req.body.Email });
    if (existingEmail) {
      console.log("Email already exists triggered for:", req.body.Email);

      return res.status(409).json({ message: "Email already exists" });
    }

    //Create a new user
    const newUser = await User.create({
      userName: req.body.userName,
      Password: hashedPassword,
      Email: req.body.Email.toLowerCase(),
    });

    // Respond with the newly created user
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("An error occurred during registration.");
  }
};

// Check if the userName or Email already exists
// await User.findOne({ userName: req.body.userName })
//   .then((user) => {
//     if (user) {
//       return res
//         .status(400)
//         .send(req.body.userName + " User already exists!");
//     } else {
//       User.create({
//         userName: req.body.userName,
//         Password: hashedPassword,
//         Email: req.body.Email,
//       })
//         .then((user) => {
//           res.status(201).json(user);
//         })
//         .catch((error) => {
//           console.log(error);
//           res
//             .status(500)
//             .send("Error occurred when creating the user", error);
//         });
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//     res.status(500).send("Something went wrong: " + error);
//   });

// get the list of all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).send("There was an error fetching users.");
  }
};

// get user by it's id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-Password") // Exclude the password field
      .populate("Thoughts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user information
export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        message: "User not found or you do not have permission to update it.",
      });
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
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "There was an error updating the user information." });
  }
};

// deregister user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user._id });

    if (!user) {
      res
        .status(404)
        .json({ message: "User not found. Account was not deleted." });
    }

    // Delete all thoughts associated with the user
    await Thought.deleteMany({ User: req.user._id });

    res.status(200).json({
      message: `Your account (${user.userName}} and all associated thoughts were deleted successfully.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
// export const deleteUser = async (req, res) => {
//   await User.findOneAndDelete({ _id: req.user._id }) // Delete based on authenticated user's ID
//     .then((user) => {
//       if (!user) {
//         res
//           .status(404)
//           .json({ message: "User not found. Account was not deleted." });
//       } else {
//         res.status(200).json({
//           message: `Your account (${user.userName}) was deleted successfully.`,
//         });
//       }
//     })
//     .catch((error) => {
//       res
//         .status(500)
//         .json({ message: "Something went wrong.", error: error.message });
//     });
// };

export const logoutUser = (req, res) => {
  res
    .status(200)
    .send(
      "Successfully logged out. Please remove the token on the client side."
    );
};
