// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Mediaschema.js');
const auth = require('../middlewares/auth');


// === Storage Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// === File Filter (Optional) ===
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp4|mov|mp3|wav/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Unsupported file type"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// === Upload Route ===
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: `uploads/${req.file.filename}`,
  });
});

// === GET all uploaded files ===

router.get("/", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to list media" });

    const media = files.map((filename) => ({
      filename,
      path: `uploads/${filename}`,
    }));

    res.json(media);
  });
});

module.exports = router;