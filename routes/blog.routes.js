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

router.get('/', auth, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

router.delete('/:id', auth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;