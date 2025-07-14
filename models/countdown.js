// models/Countdown.js
const mongoose = require('mongoose');
module.exports = mongoose.model('Countdown', new mongoose.Schema({
  event: String,
  date: Date
}));