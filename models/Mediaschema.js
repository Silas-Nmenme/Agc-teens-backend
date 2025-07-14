// models/Media.js
const mediaSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ['image', 'video', 'audio'] },
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Media', mediaSchema);