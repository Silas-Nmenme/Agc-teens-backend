exports.getAdminWelcomeEmail = (adminName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
    <h2>Welcome to AGC Teens Admin Dashboard</h2>
    <p>Hi ${adminName},</p>
    <p>Your admin account has been successfully registered.</p>
    <p>
      <a href="https://agc-teens-backend.onrender.com/login" style="background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" target="_blank">Login to Dashboard</a>
    </p>
    <p>If you did not initiate this registration, please contact support immediately.</p>
    <p>Blessings,<br><strong>AGC Teens Church Tech Team</strong></p>
  </div>
`;

exports.getLoginNotificationEmail = (adminName, ipAddress, loginTime, browserInfo) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fefefe; border-radius: 10px;">
    <h2>New Login Detected</h2>
    <p>Hi ${adminName},</p>
    <p>A new login to your admin account was detected:</p>
    <ul>
      <li><strong>IP Address:</strong> ${ipAddress}</li>
      <li><strong>Time:</strong> ${loginTime}</li>
      <li><strong>Browser:</strong> ${browserInfo}</li>
    </ul>
    <p>If this was you, no action is needed.</p>
    <p>If not, please reset your password:</p>
    <a href="https://agc-teens-backend.onrender.com/forgot-password" style="background: #f44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>Stay secure,<br><strong>AGC Teens Church Tech Team</strong></p>
  </div>
`;

exports.getPasswordResetEmail = (adminName, resetToken) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f2f8ff; border-radius: 10px;">
    <h2>Reset Your Password</h2>
    <p>Hi ${adminName},</p>
    <p>We received a request to reset your password. Click below to proceed. This link will expire in 1 hour.</p>
    <a href="https://agc-teens-backend.onrender.com/reset-password/${resetToken}" style="background: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you didn’t request this, you can ignore this message.</p>
    <p>Grace & Peace,<br><strong>AGC Teens Church Tech Team</strong></p>
  </div>
`;
