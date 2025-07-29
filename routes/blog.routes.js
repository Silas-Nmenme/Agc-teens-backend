// routes/blogs.js
const express = require("express")
const Blog = require("../models/Blog")
const auth = require("../middlewares/auth")
const router = express.Router()

// Count blogs
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: "Failed to count blogs" })
  }
})

// Get all blogs (NEW - for dashboard list)
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    res.json({ blogs })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" })
  }
})

module.exports = router
