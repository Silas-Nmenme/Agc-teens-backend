// routes/blogs.js
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middlewares/auth');


// Count Blog Posts
router.get("/count", auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to count blogs" });
  }
});

module.exports = router;