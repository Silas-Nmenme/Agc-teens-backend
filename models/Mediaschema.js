const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Original name
  storedName: { type: String, required: true }, // File saved in server (with timestamp)
  type: { type: String, required: true }, // image, video, audio
  url: { type: String, required: true }, // /uploads/filename
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);
