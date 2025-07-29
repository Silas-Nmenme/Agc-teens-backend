const express = require("express")
const router = express.Router()
const Newsletter = require("../models/Newsletter") 
const auth = require("../middlewares/auth")

// Get all subscribers count
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Newsletter.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: "Failed to count subscribers" })
  }
})

// Get all subscribers
router.get("/", auth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 })
    res.json({ subscribers })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscribers" })
  }
})

module.exports = router
