const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers");
const auth = require("../middlewares/auth");

// Get all subscribers
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count subscribers" });
  }
});

// Count subscribers
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count subscribers" });
  }
});

// Update subscriber (only email)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Subscriber.findByIdAndUpdate(req.params.id, { email: req.body.email }, { new: true });
    res.json({ message: "Subscriber updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update subscriber" });
  }
});

// Delete subscriber
router.delete("/:id", auth, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscriber deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

module.exports = router;