const mongoose = require('mongoose');
const Prayer = new mongoose.Schema({
  name: String,
  request: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Prayer', Prayer);
