const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  storedName: { type: String, required: true },
  type: { type: String, required: true }, // image, video, audio
  description: { type: String },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);