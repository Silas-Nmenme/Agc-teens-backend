// models/RSVP.js
const mongoose = require('mongoose');
module.exports = mongoose.model('RSVP', new mongoose.Schema({
  name: String,
  email: String,
  timestamp: { type: Date, default: Date.now }
}));
