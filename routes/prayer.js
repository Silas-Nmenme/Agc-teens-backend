const express = require('express');
const router = express.Router();
const PrayerRequest = require('../models/PrayerRequest');

// GET all prayer requests
router.get('/', async (req, res) => {
  try {
    const prayers = await PrayerRequest.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching prayers' });
  }
});

// POST a new prayer request
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newPrayer = new PrayerRequest({ name, email, message });
    await newPrayer.save();
    res.status(201).json(newPrayer);
  } catch (err) {
    res.status(400).json({ error: 'Invalid prayer request data' });
  }
});

// DELETE a prayer request
router.delete('/:id', async (req, res) => {
  try {
    await PrayerRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prayer request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting prayer request' });
  }
});

// PUT (Update) a prayer request
router.put('/:id', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const updatedPrayer = await PrayerRequest.findByIdAndUpdate(
      req.params.id,
      { name, email, message },
      { new: true }
    );
    res.json(updatedPrayer);
  } catch (err) {
    res.status(500).json({ error: 'Error updating prayer request' });
  }
});

module.exports = router;
