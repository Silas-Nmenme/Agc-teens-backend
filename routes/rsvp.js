const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');
const auth = require('../middlewares/auth');


// Count RSVPs
router.get("/count", auth, async (req, res) => {
  try {
    const count = await RSVP.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count RSVPs" });
  }
})

module.exports = router;