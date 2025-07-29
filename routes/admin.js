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

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." })
    }
    const existing = await Admin.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: "Email already registered" })
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationExpires = Date.now() + 10 * 60 * 1000 // 10 mins

    const admin = new Admin({
      name,
      username,
      email,
      phone,
      password,
      verificationCode,
      verificationExpires,
    })
    await admin.save()

    // Send verification email
    await transporter.sendMail({
      from: `"AGC Teens Admin" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "Verify Your Admin Account",
      html: `
        <h3>Welcome to Teens Church Admin</h3>
        <p>Your verification code is:</p>
        <h1>${verificationCode}</h1>
        <p>This code expires in 10 minutes. Please do not share it.</p>
      `,
    })

    res.status(201).json({ message: "Registration successful! Verification code sent to email." })
  } catch (err) {
    res.status(500).json({ error: "Registration failed" })
  }
})

// Verify Code
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin) return res.status(404).json({ error: "Admin not found" })
  if (admin.verificationCode !== code || admin.verificationExpires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired code" })
  }
  admin.isVerified = true
  admin.verificationCode = null
  admin.verificationExpires = null
  await admin.save()
  res.json({ message: "Email verified successfully!" })
})

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" })
  }
  admin.lastLogin = new Date()
  await admin.save()
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "2h" })
  res.json({
    token,
    name: admin.name,
    email: admin.email,
    lastLogin: admin.lastLogin,
  })
})

// Get current admin profile (for dashboard) - FIXED ENDPOINT
router.get("/me", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password")
    if (!admin) return res.status(404).json({ error: "Admin not found" })

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role || "admin",
      lastLogin: admin.lastLogin || null,
    })
  } catch (err) {
    console.error("Admin /me route error:", err.message)
    res.status(500).json({ error: "Failed to fetch admin info" })
  }
})

// Admin Logout
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" })
      res.clearCookie("connect.sid")
      res.status(200).json({ message: "Logged out successfully" })
    })
  } else {
    res.status(200).json({ message: "Logged out successfully" })
  }
})

// RSVP Count - FIXED PATH
router.get("/rsvps/count", auth, async (req, res) => {
  try {
    const count = await RSVP.countDocuments()
    res.json({ count })
  } catch (err) {
    console.error("RSVP count error:", err)
    res.status(500).json({ error: "Failed to count RSVPs" })
  }
})

// Prayer Count - FIXED PATH
router.get("/prayers/count", auth, async (req, res) => {
  try {
    const count = await Prayer.countDocuments()
    res.json({ count })
  } catch (err) {
    console.error("Prayer count error:", err)
    res.status(500).json({ error: "Failed to count prayers" })
  }
})

// Subscriber Count - FIXED PATH
router.get("/subscribers/count", auth, async (req, res) => {
  try {
    const count = await Newsletter.countDocuments()
    res.json({ count })
  } catch (err) {
    console.error("Subscriber count error:", err)
    res.status(500).json({ error: "Failed to count subscribers" })
  }
})

// Blog Count - NEW ENDPOINT
router.get("/blogs/count", auth, async (req, res) => {
  try {
    // If you have a Blog model, use it. Otherwise return 0
    try {
      const Blog = require("../models/Blog")
      const count = await Blog.countDocuments()
      res.json({ count })
    } catch (modelError) {
      // If Blog model doesn't exist, return 0
      res.json({ count: 0 })
    }
  } catch (err) {
    console.error("Blog count error:", err)
    res.status(500).json({ error: "Failed to count blogs" })
  }
})

// Get Countdown
router.get("/countdown", async (req, res) => {
  try {
    const data = await Countdown.findOne()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countdown" })
  }
})

// Set Countdown
router.post("/countdown", auth, async (req, res) => {
  const { event, date } = req.body
  try {
    let countdown = await Countdown.findOne()
    if (countdown) {
      countdown.event = event
      countdown.date = date
    } else {
      countdown = new Countdown({ event, date })
    }
    await countdown.save()
    res.json({ message: "Countdown saved", countdown })
  } catch (err) {
    res.status(500).json({ error: "Failed to save countdown" })
  }
})

// Update admin profile
router.put("/profile", auth, async (req, res) => {
  const { name, email, password } = req.body
  try {
    const admin = await Admin.findById(req.user.id)
    if (!admin) return res.status(404).json({ error: "Admin not found" })
    admin.name = name || admin.name
    admin.email = email || admin.email
    if (password && password.trim()) {
      admin.password = password // Will be hashed in pre-save hook
    }
    await admin.save()
    res.json({ message: "Profile updated successfully" })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
