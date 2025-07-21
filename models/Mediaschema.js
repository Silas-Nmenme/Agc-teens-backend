const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true, // Stored filename on disk
  },
  originalname: {
    type: String,
    required: true, // Original filename from user
  },
  path: {
    type: String,
    required: true, // Relative path to file
  },
  size: {
    type: Number,
    required: true, // File size in bytes
  },
  mimetype: {
    type: String,
    required: true, // MIME type of file
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to uploader (Admin)
    required: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now, // Upload timestamp
  },
});

module.exports = mongoose.model("Media", mediaSchema);
