// routes/blogs.js
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.create({ title, content });
  res.json(blog);
});

// Blog Count
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count blogs' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;