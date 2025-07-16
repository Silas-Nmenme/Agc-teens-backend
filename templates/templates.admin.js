// config/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `https://agc-teens.onrender.com/verify?token=${token}`;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px;">
        <h2 style="color: #333;">Verify Your Admin Account</h2>
        <p style="font-size: 16px; color: #555;">
          Hi there! Thank you for registering as an admin on the AGC Akowonjo Teens Dashboard.
        </p>
        <p style="font-size: 16px; color: #555;">
          Please click the button below to verify your account:
        </p>
        <a href="${verificationLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #ff6e7f; color: white; text-decoration: none; border-radius: 5px;">Verify Account</a>
        <p style="margin-top: 30px; font-size: 14px; color: #999;">If you didn’t create this account, please ignore this message.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"AGC Teens Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your AGC Teens Admin Account',
    html: htmlTemplate,
  });
};

module.exports = sendVerificationEmail;
