// models/PrayerRequest.js
const mongoose = require('mongoose');
module.exports = mongoose.model('PrayerRequest', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}));