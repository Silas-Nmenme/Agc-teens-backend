const mongoose = require('mongoose');
const Chat = new mongoose.Schema({
  message: String,
  sender: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', Chat);