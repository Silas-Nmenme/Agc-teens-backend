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
 * sendEmail - Sends email using either a predefined template or raw content
 * @param {string} to - recipient email
 * @param {string|null} template - template name (e.g. 'rsvp', 'newsletter', 'prayer') or null for raw
 * @param {object} data - either template data or { subject, html, text }
 */
const sendEmail = async (to, template = null, data = {}) => {
  try {
    let subject, html, text;

    if (template && typeof emailTemplates[`${template}Template`] === 'function') {
      const tpl = emailTemplates[`${template}Template`](data.name || data.email);
      subject = tpl.subject;
      html = tpl.html;
      text = tpl.text;
    } else {
      subject = data.subject;
      html = data.html;
      text = data.text;
    }

    const mailOptions = {
      from: `"AGC Teens Church" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}:`, info.response);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};

module.exports = sendEmail;
