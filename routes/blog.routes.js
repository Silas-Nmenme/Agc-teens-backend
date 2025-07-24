// routes/blogs.js
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middlewares/auth');
const router = express.Router();


// Get all blogs
router.get("/", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Count blogs
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count blogs" });
  }
});

// Update blog
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Blog updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete blog
router.delete("/:id", auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;