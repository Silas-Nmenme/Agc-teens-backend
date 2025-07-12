const mongoose = require('mongoose');
const Newsletter = new mongoose.Schema({
  email: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Newsletter', Newsletter);
