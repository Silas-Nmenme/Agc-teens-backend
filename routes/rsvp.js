const express = require("express")
const router = express.Router()
const RSVP = require("../models/RSVP")
const auth = require("../middlewares/auth")

// Count RSVPs
router.get("/count", auth, async (req, res) => {
  try {
    const count = await RSVP.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: "Failed to count RSVPs" })
  }
})

// Get all RSVPs (NEW - for dashboard list)
router.get("/", auth, async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 })
    res.json({ rsvps })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RSVPs" })
  }
})

module.exports = router
