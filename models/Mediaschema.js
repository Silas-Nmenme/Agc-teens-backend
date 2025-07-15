// models/Media.js
const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);