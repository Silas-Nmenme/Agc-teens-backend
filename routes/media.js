// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Mediaschema.js');
const auth = require('../middlewares/auth');


// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload Media
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const media = new Media({
      filename: req.file.filename,
      path: req.file.path,
      type: req.file.mimetype,
    });
    await media.save();
    res.status(201).json({ message: 'Media uploaded successfully', media });
  } catch (err) {
    console.error('Media upload error:', err);
    res.status(500).json({ error: 'Media upload failed' });
  }
});

// Get All Media
router.get('/', auth, async (req, res) => {
  try {
    const mediaFiles = await Media.find().sort({ createdAt: -1 });
    res.json(mediaFiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

module.exports = router;