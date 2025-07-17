// routes/media.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Mediaschema.js');
const auth = require('../middlewares/auth');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { type, description } = req.body;
    const originalName = req.file.originalname;
    const storedName = req.file.filename;
    const url = '/uploads/' + storedName;

    const media = await Media.create({
      filename: originalName,
      storedName,
      type,
      description,
      url
    });

    res.json(media);
  } catch (err) {
    console.error('Media upload failed:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});


router.get('/', auth, async (req, res) => {
  const media = await Media.find().sort({ uploadedAt: -1 });
  res.json(media);
});

router.delete('/:id', auth, async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  const filePath = path.join(__dirname, '../', media.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await media.remove();
  res.json({ message: 'Deleted' });
});

module.exports = router;
