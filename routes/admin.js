// routes/admin.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Adminschema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const auth = require('../middlewares/auth');
const RSVP = require('../models/RSVP');
const PrayerRequest = require('../models/Prayer');
const Newsletter = require('../models/Newsletter');
const Countdown = require('../models/countdown');

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


//Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ name, email, password: hashed });
  await admin.save();
  res.status(201).json({ message: 'Admin registered successfully' });
});


//Login

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, admin: { name: admin.name, email: admin.email } });
});

// Get RSVPs
router.get('/rsvps', auth, async (req, res) => {
  const rsvps = await RSVP.find().sort({ timestamp: -1 });
  res.json(rsvps);
});


// Get Prayer Requests
router.get('/prayers', auth, async (req, res) => {
  const prayers = await PrayerRequest.find().sort({ timestamp: -1 });
  res.json(prayers);
});

// Get Newsletter Subscribers
router.get('/newsletter', auth, async (req, res) => {
  const list = await Newsletter.find().sort({ subscribedAt: -1 });
  res.json(list);
});

// Get/Set Countdown
router.get('/countdown', async (req, res) => {
  const data = await Countdown.findOne();
  res.json(data);
});

router.post('/countdown', auth, async (req, res) => {
  const { event, date } = req.body;
  let countdown = await Countdown.findOne();
  if (countdown) {
    countdown.event = event;
    countdown.date = date;
  } else {
    countdown = new Countdown({ event, date });
  }
  await countdown.save();
  res.json({ message: 'Countdown saved', countdown });
});

module.exports = router;
