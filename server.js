const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
require('dotenv').config();
const sendEmail = require('./config/emailService');
const jwt = require('jsonwebtoken');
const Admin = require('./models/Admin');
const requireAuth = require('./middlewares/auth.js');


// Import Models
const RSVP = require('./models/RSVP');
const Newsletter = require('./models/Newsletter');
const Prayer = require('./models/Prayer');
const Chat = require('./models/Chats');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());


// RSVP Endpoint
app.post('/api/rsvp', async (req, res) => {
  const { name, email } = req.body;

  try {
    await RSVP.create({ name, email });
    res.json({ message: `Thank you ${name}, your RSVP has been received.` });

    if (email) {
      sendEmail(email, 'rsvp', { name });
    }

    // No admin email
  } catch (err) {
    console.error('RSVP error:', err.message);
    res.status(500).json({ message: 'RSVP failed.' });
  }
});


//Newsletter End Point
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;

  try {
    await Newsletter.create({ email });
    res.json({ message: `You're subscribed! Confirmation sent.` });

    sendEmail(email, 'newsletter', { email });

    // No admin email
  } catch (err) {
    console.error('Newsletter error:', err.message);
    res.status(500).json({ message: 'Newsletter subscription failed.' });
  }
});

//Prayer Request Endpoint
app.post('/api/prayer', async (req, res) => {
  const { name, email, request } = req.body;

  try {
    await Prayer.create({ name, request });

    res.json({ message: `Thanks ${name}, your prayer was received.` });

    // Send confirmation to user only
    if (email) {
      await sendEmail(email, 'prayer', { name });
    }

    // Send full content to admin as raw email (NOT using the template)
    await sendEmail(process.env.ADMIN_EMAIL, null, {
      subject: `New Prayer Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Prayer Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          <p><strong>Message:</strong></p>
          <blockquote style="background:#f9f9f9; padding:10px; border-left:4px solid #2575fc;">
            ${request}
          </blockquote>
        </div>
      `,
      text: `New Prayer Request from ${name}\n\n${email ? `Email: ${email}\n\n` : ''}Message:\n${request}`
    });

  } catch (err) {
    console.error('Prayer route error:', err.message);
    res.status(500).json({ message: 'Prayer request failed.' });
  }
});


// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const saved = await Chat.create({ message });
    res.json({ reply: "Thank you for reaching out! We'll respond soon." });
  } catch (err) {
    res.status(500).json({ message: 'Chat error' });
  }
});

//Route
app.get('/', (req, res) => {
  res.send('AGC Teens Backend is Running');
});


app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});


app.get('/api/admin/prayers', requireAuth, async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch prayers' });
  }
});


// Start Server
app.listen(PORT, ()=> {
    connectDB()
    console.log(`Server is running on http://localhost:${PORT}`)
})
