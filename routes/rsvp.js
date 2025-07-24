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
});

// Update RSVP
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await RSVP.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "RSVP updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update RSVP" });
  }
});

// Delete RSVP
router.delete("/:id", auth, async (req, res) => {
  try {
    await RSVP.findByIdAndDelete(req.params.id);
    res.json({ message: "RSVP deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete RSVP" });
  }
});

module.exports = router;