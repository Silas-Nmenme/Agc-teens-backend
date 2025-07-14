// models/RSVP.js
const mongoose = require('mongoose');

const RSVPSchema = new mongoose.Schema({
  name: String,
  email: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RSVP', RSVPSchema);
