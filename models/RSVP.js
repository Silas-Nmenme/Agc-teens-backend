const mongoose = require("mongoose");

const RsvpSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RSVP", RsvpSchema);
