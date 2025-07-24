const express = require("express");
const router = express.Router();
const Prayer = require("../models/PrayerRequest");
const auth = require('../middlewares/auth');

// Get all prayers
router.get("/", auth, async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.json({ prayers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prayers" });
  }
});

// Count prayers
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Prayer.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count prayers" });
  }
});

// Update prayer
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Prayer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Prayer updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update prayer" });
  }
});

// Delete prayer
router.delete("/:id", auth, async (req, res) => {
  try {
    await Prayer.findByIdAndDelete(req.params.id);
    res.json({ message: "Prayer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete prayer" });
  }
});

module.exports = router;