const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
require('dotenv').config();
const sendEmail = require('./config/emailService');



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


// 📅 RSVP Endpoint
app.post('/api/rsvp', async (req, res) => {
  const { name, email } = req.body;
  console.log('📥 Incoming RSVP:', { name, email });

  try {
    const saved = await RSVP.create({ name, email });
    console.log('✅ RSVP saved:', saved);

    // ✅ Respond IMMEDIATELY to frontend
    res.json({ message: `Thank you ${name}, your RSVP has been received.` });

    // 🚀 Send emails in the background
    if (email) {
      sendEmail(email, 'rsvp', { name }).catch(err =>
        console.error('❌ User RSVP email failed:', err.message)
      );
    }

    sendEmail(process.env.ADMIN_EMAIL, 'rsvp', { name }).catch(err =>
      console.error('❌ Admin RSVP email failed:', err.message)
    );
  } catch (err) {
    console.error('❌ RSVP error:', err.message);
    res.status(500).json({ message: 'Failed to process RSVP.' });
  }
});


//Newsletter End Point
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  console.log('📥 Newsletter subscription received:', email);

  try {
    const saved = await Newsletter.create({ email });
    console.log('✅ Newsletter saved:', saved);

    // ✅ Respond immediately
    res.json({ message: `You're subscribed! A confirmation email has been sent.` });

    // 🚀 Send emails asynchronously
    if (email) {
      sendEmail(email, 'newsletter').catch(err =>
        console.error('❌ Failed to send newsletter email to user:', err.message)
      );
    }

    sendEmail(process.env.ADMIN_EMAIL, 'newsletter').catch(err =>
      console.error('❌ Failed to send newsletter email to admin:', err.message)
    );
  } catch (err) {
    console.error('❌ Newsletter backend error:', err);
    res.status(500).json({ message: 'Newsletter subscription failed.' });
  }
});


// 🙏 Prayer Request Endpoint
app.post('/api/prayer', async (req, res) => {
  const { name, request, email } = req.body;
  console.log('📥 Prayer request received:', { name, request, email });

  try {
    const saved = await Prayer.create({ name, request });
    console.log('✅ Prayer saved:', saved);

    // ✅ Respond immediately
    res.json({ message: `Thanks ${name}, your prayer was received.` });

    // 🚀 Send emails asynchronously
    if (email) {
      sendEmail(email, 'prayer', { name }).catch(err =>
        console.error('❌ Failed to send prayer confirmation to user:', err.message)
      );
    }

    sendEmail(process.env.ADMIN_EMAIL, 'prayer', { name }).catch(err =>
      console.error('❌ Failed to send prayer copy to admin:', err.message)
    );
  } catch (err) {
    console.error('❌ Prayer backend error:', err);
    res.status(500).json({ message: 'Prayer request submission failed.' });
  }
});


// 💬 Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const saved = await Chat.create({ message });
    res.json({ reply: "Thank you for reaching out! We'll respond soon." });
  } catch (err) {
    res.status(500).json({ message: 'Chat error' });
  }
});

// 🌐 Root Route
app.get('/', (req, res) => {
  res.send('🎉 AGC Teens Backend is Running');
});

// 🚀 Start Server
app.listen(PORT, ()=> {
    connectDB()
    console.log(`Server is running on http://localhost:${PORT}`)
})
