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
const sendVerificationEmail = require('../templates/templates.admin');

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
    console.log('[DEBUG] Request body:', req.body);

    const { name, username, email, phone, password } = req.body;
    if (!name || !email || !password) {
      console.error('[DEBUG] Validation failed:', { name, email, password });
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await Admin.findOne({ email });
    console.log('[DEBUG] existing user:', existing);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('[DEBUG] Generated verificationToken');

    const admin = new Admin({ name, username, email, phone, password, verificationToken });
    await admin.save();
    co // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    admin.verificationCode = code;
    admin.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 mins
// Send verification email
    await transporter.sendMail({
      from: 'agcteenchurchofficial@gmail.com',
      to: admin.email,
      subject: 'Verify Your Admin Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Welcome to Teens Church Admin</h2>
          <p>Hi ${name},</p>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">${code}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not register, please ignore this email.</p>
        </div>
      `
    });
     res.status(201).json({
      message: 'Admin registered. Verification code sent to email.',
      email: admin.email
    });

  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  if (
    admin.verificationCode !== code ||
    admin.verificationExpires < Date.now()
  ) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  admin.isVerified = true;
  admin.verificationCode = null;
  admin.verificationExpires = null;
  await admin.save();

  res.json({ message: 'Verification successful' });
});


// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login time
  admin.lastLogin = new Date();
  await admin.save();

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '2h' });

  res.json({
    token,
    name: admin.name,
    email: admin.email,
    lastLogin: admin.lastLogin
  });
});

router.get('/me', auth, async (req, res) => {
  const admin = await Admin.findById(req.user.id).select('-password');
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  res.json(admin);
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

// Update admin profile
router.put('/profile', auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    if (password && password.trim()) {
      admin.password = password; // Will be hashed in pre-save hook
    }

    await admin.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;