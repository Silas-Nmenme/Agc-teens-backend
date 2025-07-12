const mongoose = require('mongoose');
const RSVP = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('RSVP', RSVP);