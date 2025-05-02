import models from "../models/models";
const { Gratitude, User } = models;

// Add a new gratefulness entry
export const addGratitude = async (req, res) => {
  try {
    console.log("Incoming gratitude request from user:", req.user);

    const newEntry = new Gratitude({
      message: req.body.message,
      // detail: req.body.detail,
      User: req.user._id,
    });

    const savedEntry = await newEntry.save();
    // Add the new gratitude to the user's gratitude array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { Gratitudes: savedEntry._id },
    });

    res.status(201).json(savedEntry);
  } catch (err) {
    console.error("Error adding gratefulness:", err);
    res.status(500).send("Server error while adding gratefulness");
  }
};

// Get all entries for the logged-in user
export const getGratitudeEntries = async (req, res) => {
  try {
    const entries = await Gratitude.find({ User: req.user._id }).sort({
      created_date: -1,
    });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).send("Error fetching gratefulness entries");
  }
};

// Get one entry by ID
export const getGratitudeById = async (req, res) => {
  try {
    const gratitudeId = req.params.gratitudeId;

    const gratitude = await Gratitude.findById(gratitudeId).populate(
      "User",
      "userName Email"
    );

    if (!gratitude) {
      return res.status(404).send("Gratefulness entry not found");
    }
    res.status(200).json(gratitude);
  } catch (err) {
    res.status(500).send("Error fetching entry");
  }
};

// Update entry
export const updateGratitude = async (req, res) => {
  try {
    const entry = await Gratitude.findOne({
      _id: req.params.gratitudeId,
      User: req.user._id,
    });

    if (!entry) {
      return res.status(404).send("Entry not found");
    }

    if (req.body.message) entry.message = req.body.message;
    if (req.body.details) entry.details = req.body.details;

    const updated = await entry.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send("Error updating entry");
  }
};

// Delete entry
export const deleteGratitude = async (req, res) => {
  try {
    const deleted = await Gratitude.findOneAndDelete({
      _id: req.params.gratitudeId,
      User: req.user._id,
    });

    if (!deleted) {
      return res.status(404).send("Entry not found or unauthorized");
    }

    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).send("Error deleting entry");
  }
};
