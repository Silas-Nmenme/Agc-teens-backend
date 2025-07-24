require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const sendEmail = require('./config/emailService');
const jwt = require("jsonwebtoken");
const Adminschema = require('./models/Adminschema.js');
const requireAuth = require('./middlewares/auth.js');
const adminRoutes = require('./routes/admin.js');
const path = require("path");

const app = express();
app.use(express.json());

// Import Models
const RSVP = require('./models/RSVP');
const Newsletter = require('./models/Newsletter');
const PrayerRequest = require('./models/PrayerRequest.js');
const Chat = require('./models/Chats');
const Blog = require('./models/Blog.js');
const Subscribers = require('./models/subscribers.js');


const PORT = process.env.PORT || 4500;

// Middleware
app.use(cors());

//Media upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/rsvp', require('./routes/rsvp'));
app.use("/api/prayers", require("./routes/prayer.js"));
app.use("/api/blogs", require("./routes/blog.routes.js"));
app.use("/api/subscribers", require("./routes/subscribers.js"));

// Media Routes
const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);



// RSVP Endpoint
app.post('/api/rsvp', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Save to MongoDB using your existing schema
    await RSVP.create({ name, email });

    // Respond to user
    res.json({ message: `Thank you ${name}, your RSVP has been received.` });

    // Send confirmation email if provided
    if (email) {
      await sendEmail(email, 'rsvp', { name });
    }

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

  if (!name || !request) {
    return res.status(400).json({ message: 'Name and prayer request are required.' });
  }

  try {
    // Save to database
   await PrayerRequest.create({ name, email, message: request });


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