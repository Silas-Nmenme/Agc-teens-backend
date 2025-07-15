const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');

router.get('/', async (req, res) => {
  try {
    const rsvps = await RSVP.find();
    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;