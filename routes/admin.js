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
const Prayer = require('../models/PrayerRequest');

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
console.log("Incoming registration:", req.body);

    // Create verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create user
    const admin = await Admin.create({
      name,
      email,
      password,
      verificationToken
    });

    // Send email
    const verifyUrl = `https://agc-teens-backend.onrender.com/api/admin/verify/${verificationToken}`;
    await sendEmail(email, 'Verify Your Email', `
      <h2>Welcome, ${name}!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Now</a>
    `);

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) return res.status(400).send('Invalid token or user not found.');
    if (admin.isVerified) return res.status(200).send('Email already verified.');

    admin.isVerified = true;
    admin.verificationToken = null;
    await admin.save();

    res.send('Email verified successfully! You can now log in.');

  } catch (err) {
    console.error('Verification Error:', err);
    res.status(400).send('Invalid or expired token.');
  }
});


// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, JWT_SECRET);
  res.json({ token });
});

// Admin Logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

// Get RSVPs
router.get('/rsvp', auth, async (req, res) => {
  const rsvps = await RSVP.find().sort({ createdAt: -1 });
  res.json(rsvps);
});

// Get Prayer Requests
router.get('/prayers', auth, async (req, res) => {
  const prayers = await Prayer.find().sort({ createdAt: -1 });
  res.json(prayers);
});

// Get Newsletter Subscribers
router.get('/subscribers', auth, async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  res.json(subscribers);
});

// Get Countdown
router.get('/countdown', async (req, res) => {
  const data = await Countdown.findOne();
  res.json(data);
});

// Set Countdown
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