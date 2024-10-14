import { Thought } from '../models/models';

/* 
First controller to pass to the endpoints in routes,
Let the user add a new thought
*/

export const addNewThought = async (req, res) => {
  let newThought = new Thought(req.body);
  try {
    const savedNewThought = await newThought.save();
    return res.status(201).json(savedNewThought);
  } catch (err) {
    console.error('Error saving the new thought:', err);
    // Respond with a 500 status and error message
    return res.status(500).send('There was an error saving the new thought!');
  }
};

export const getThoughts = async (req, res) => {
  await Thought.find()
    .then((thoughts) => {
      res.status(201).json(thoughts);
    })
    .catch((err) => {
      res.status(500).send('Error getting all thoughts', err);
    });
};

export const getThoughtByName = async (req, res) => {
  await Thought.findOne({ thoughtName: req.params.thoughtName })
    .then((thought) => {
      res.status(201).json(thought);
    })
    .catch((err) => {
      res.status(500).send('Unable to retrieve the thought', err);
    });
};

export const updateThought = async (req, res) => {
  await Thought.findOneAndUpdate(
    { thoughtName: req.params.thoughtName },
    req.body,
    {
      new: true,
    }
  )
    .then((updatedThought) => res.status(201).json(updatedThought))
    .catch((err) => res.status(500).send(err));
};

export const deleteThought = async (req, res) => {
  await Thought.findOneAndDelete({ thoughtName: req.params.thoughtName }).then(
    () => {
      res
        .status(200)
        .send(req.params.thoughtName + ' was deleted.')
        .catch((err) =>
          res
            .status(500)
            .send('Could not delete ' + req.params.thoughtName, err)
        );
    }
  );
};
