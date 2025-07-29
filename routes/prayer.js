const express = require("express")
const router = express.Router()
const Prayer = require("../models/PrayerRequest")
const auth = require("../middlewares/auth")

// Count prayers
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Prayer.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: "Failed to count prayers" })
  }
})

// Get all prayers (NEW - for dashboard list)
router.get("/", auth, async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 })
    res.json({ prayers })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prayers" })
  }
})

module.exports = router
