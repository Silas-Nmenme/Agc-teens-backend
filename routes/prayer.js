const express = require("express");
const router = express.Router();
const Prayer = require("../models/PrayerRequest");
const auth = require('../middlewares/auth');

// Count prayers
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Prayer.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count prayers' });
  }
});

module.exports = router;