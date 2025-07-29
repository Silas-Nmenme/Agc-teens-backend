require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const connectDB = require("./config/db")
const sendEmail = require("./config/emailService")
const path = require("path")
const app = express()
const router = express.Router()

const PORT = process.env.PORT || 4500

// Middleware
// ===================
app.use(cors())
app.use(express.json()) // very important for POST/PUT
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Models
// ===================
const RSVP = require("./models/RSVP")
const Newsletter = require("./models/Newsletter")
const PrayerRequest = require("./models/PrayerRequest")
const Chat = require("./models/Chats")

// Register Routes 
// ===================
app.use("/api/admin", require("./routes/admin"))
app.use("/api/rsvps", require("./routes/rsvp"))
app.use("/api/prayers", require("./routes/prayer"))
app.use("/api/blogs", require("./routes/blog.routes"))
app.use("/api/subscribers", require("./routes/subscribers"))
app.use("/api/media", require("./routes/media"))

// Public API Endpoints
// ===================

// RSVP Form Submission
app.post("/api/rsvp", async (req, res) => {
  const { name, email } = req.body
  try {
    await RSVP.create({ name, email })
    res.json({ message: `Thank you ${name}, your RSVP has been received.` })
    if (email) await sendEmail(email, "rsvp", { name })
  } catch (err) {
    console.error("RSVP error:", err.message)
    res.status(500).json({ message: "RSVP failed." })
  }
})

// Newsletter Form
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body
  try {
    await Newsletter.create({ email })
    res.json({ message: `You're subscribed! Confirmation sent.` })
    if (email) sendEmail(email, "newsletter", { email })
  } catch (err) {
    console.error("Newsletter error:", err.message)
    res.status(500).json({ message: "Newsletter subscription failed." })
  }
})

// Prayer Request Form
app.post("/api/prayer", async (req, res) => {
  const { name, email, request } = req.body
  if (!name || !request) return res.status(400).json({ message: "Name and prayer request are required." })

  try {
    await PrayerRequest.create({ name, email, message: request })
    res.json({ message: `Thanks ${name}, your prayer was received.` })

    if (email) await sendEmail(email, "prayer", { name })

    await sendEmail(process.env.ADMIN_EMAIL, null, {
      subject: `New Prayer Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Prayer Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          <p><strong>Message:</strong></p>
          <blockquote style="background:#f9f9f9; padding:10px; border-left:4px solid #2575fc;">
            ${request}
          </blockquote>
        </div>
      `,
      text: `New Prayer Request from ${name}\n\n${email ? `Email: ${email}\n\n` : ""}Message:\n${request}`,
    })
  } catch (err) {
    console.error("Prayer route error:", err.message)
    res.status(500).json({ message: "Prayer request failed." })
  }
})

// Chat Logging
app.post("/api/chat", async (req, res) => {
  const { message } = req.body
  try {
    await Chat.create({ message })
    res.json({ reply: "Thank you for reaching out! We'll respond soon." })
  } catch (err) {
    res.status(500).json({ message: "Chat error" })
  }
})

// Root
app.get("/", (req, res) => {
  res.send("AGC Teens Backend is Running")
})

// Start Server
// ===================
app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running at http://localhost:${PORT}`)
})
