const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
// Count Subscribers
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count subscribers" });
  }
});

module.exports = router;
