import models from "../models/models";
const { Thought } = models;
const { User } = models;
// import { encrypt, decrypt } from '../utils/encryption';

/* 
First controller to pass to the endpoints in routes,
Let the user add a new thought
*/

export const addNewThought = async (req, res) => {
  let newThought = new Thought({
    thoughtName: req.body.thoughtName,
    User: req.user._id,
  });
  try {
    // Save new thought to database
    const savedNewThought = await newThought.save();

    // Add the new thought to the user's Thoughts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { Thoughts: savedNewThought._id },
    });

    // Respond with newly created thought
    return res.status(201).json(savedNewThought);
  } catch (err) {
    console.error("Error saving the new thought:", err);
    console.error("Stack trace:", err.stack);

    // Respond with a 500 status and error message
    return res.status(500).send("There was an error saving the new thought!");
  }
};

export const updateThought = async (req, res) => {
  try {
    // Find the thought by its ID and ensure it belongs to the logged-in user
    const thought = await Thought.findOne({
      _id: req.params.thoughtId,
      User: req.user._id,
    });

    if (!thought) {
      return res
        .status(404)
        .send("Thought not found or you do not have permission to update it.");
    }

    // Update only the fields provided in the request body
    if (req.body.thoughtName) {
      thought.thoughtName = req.body.thoughtName;
    }
    if (req.body.Description) {
      thought.Description = req.body.Description;
    }
    if (req.body.Emotions) {
      thought.Emotions = req.body.Emotions;
    }
    if (req.body.Problems) {
      thought.Problems = req.body.Problems;
    }
    if (req.body.possibleSolutions) {
      thought.possibleSolutions = req.body.possibleSolutions;
    }
    if (req.body.Affirmation) {
      thought.Affirmation = req.body.Affirmation;
    }

    // Save the updated thought
    const updatedThought = await thought.save();

    return res.status(200).json(updatedThought);
  } catch (err) {
    console.error("Error updating the thought:", err);

    return res.status(500).send("There was an error updating the thought!");
  }
};

export const getOwnThoughts = async (req, res) => {
  try {
    // Find thoughts that belong to the logged-in user
    const thoughts = await Thought.find({ User: req.user._id });

    // Check if there are no thoughts
    // if (thoughts.length === 0) {
    //   return res.status(404).json({ message: 'No thoughts found.' });
    // }

    // Send the found thoughts
    res.status(200).json(thoughts);
  } catch (err) {
    console.error("Error fetching thoughts:", err);
    return res.status(500).send("There was an error fetching thoughts.");
  }
};

// export const getThoughtByName = async (req, res) => {
//   console.log('Received thoughtName:', req.params.thoughtName);

//   await Thought.findOne({ thoughtName: req.params.thoughtName })
//     .then((thought) => {
//       if (!thought) {
//         return res.status(404).json({ message: 'Thought not found.' });
//       }
//       res.status(200).json(thought);
//     })
//     .catch((err) => {
//       res.status(500).send('Unable to retrieve the thought', err);
//     });
// };

export const getThoughtById = async (req, res) => {
  console.log("Received request for thoughtId:", req.params.thoughtId);

  try {
    const thoughtId = req.params.thoughtId;

    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteThought = async (req, res) => {
  await Thought.findOneAndDelete({
    _id: req.params.thoughtId,
    User: req.user._id,
  })
    .then((thought) => {
      if (!thought) {
        return res
          .status(404)
          .send(
            "Thought not found or you do not have permission to delete it."
          );
      }
      res.status(200).json({ message: req.params.thoughtId + " was deleted." });
    })
    .catch((err) => {
      res.status(500).send("Could not delete " + req.params.thoughtId, err);
    });
};
