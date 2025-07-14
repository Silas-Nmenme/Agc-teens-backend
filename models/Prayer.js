const mongoose = require('mongoose');

const PrayerRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrayerRequest', PrayerRequestSchema);