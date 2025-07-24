const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribers");
const auth = require("../middlewares/auth");

// Get all subscribers
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ subscribers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});


module.exports = router;