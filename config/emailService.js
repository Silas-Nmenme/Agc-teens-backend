const nodemailer = require('nodemailer');

const emailTemplates = require('../templates/emailTemplate.js'); // or './emailTemplate' if same dir


require('dotenv').config();

  const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

/**
 * Send formatted HTML email
 * @param {string} to - Recipient
 * @param {string} template - 'rsvp' | 'newsletter' | 'prayer'
 * @param {object} data - Data needed for template
 */
const sendEmail = async (to, template, data = {}) => {
  let emailContent;

  switch (template) {
    case 'rsvp':
      emailContent = emailTemplates.rsvpTemplate(data.name);
      break;
    case 'newsletter':
      emailContent = emailTemplates.newsletterTemplate(to);
      break;
    case 'prayer':
      emailContent = emailTemplates.prayerTemplate(data.name);
      break;
    default:
      throw new Error('Invalid template');
  }

  try {
    await transporter.sendMail({
      from: `"AGC Teens Church" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

module.exports = sendEmail;
