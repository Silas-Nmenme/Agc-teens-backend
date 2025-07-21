const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middlewares/auth");
const Media = require("../models/Mediaschema.js");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif|mp4|mov|mp3|wav/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload media
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    const media = new Media({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
      uploadedBy: req.user?.id || null, // If you want to track uploader
    });
    await media.save();
    res.status(201).json({ message: "Upload successful", media });
  } catch (err) {
    res.status(500).json({ error: "Failed to save media" });
  }
});

// Get all media
router.get("/", authMiddleware, async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 });
    res.json({ media });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Delete media
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    const filePath = path.join(__dirname, "../", media.path);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    res.json({ message: "Media deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;
