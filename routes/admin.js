// routes/admin.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Adminschema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const auth = require('../middlewares/auth');
const RSVP = require('../models/RSVP');
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
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
});

//Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});


// Get RSVPs
router.get('/', auth, async (req, res) => {
  const rsvps = await RSVP.find().sort({ createdAt: -1 });
  res.json(rsvps);
});


// Get Prayer Requests
router.get('/', auth, async (req, res) => {
  const prayers = await Prayer.find().sort({ createdAt: -1 });
  res.json(prayers);
});


// Get Newsletter Subscribers
router.get('/', auth, async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subscribers);
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
