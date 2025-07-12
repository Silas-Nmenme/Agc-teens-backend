module.exports = {
  // RSVP Template
  rsvpTemplate: (name, baseUrl = 'http://localhost:4000') => {
    const subject = 'RSVP Confirmation – AGC Teens Church';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #2575fc;">${subject}</h2>
        <p style="font-size: 1rem;">Hi ${name},</p>
        <p style="font-size: 1rem;">Thank you for RSVPing. We're excited to see you at the next Teens Church event!</p>
        <p style="font-size: 1rem;">You can visit our website for updates and resources.</p>
        <a href="${baseUrl}" style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#2575fc; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Visit Website</a>
        <p style="font-size: 0.95rem; color: #555; margin-top: 30px;">With love,<br><strong>AGC Akowonjo Teens Church</strong></p>
      </div>
    `;
    const text = `Hi ${name},\n\nThank you for RSVPing. We're excited to see you at the next Teens Church event!\n\nVisit: ${baseUrl}\n\nWith love,\nAGC Akowonjo Teens Church`;
    return { subject, html, text };
  },

  // Newsletter Template
  newsletterTemplate: (email, baseUrl = 'http://localhost:4000') => {
    const subject = 'Newsletter Subscription – AGC Teens Church';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #2575fc;">${subject}</h2>
        <p style="font-size: 1rem;">Hi ${email},</p>
        <p style="font-size: 1rem;">Thank you for subscribing to our newsletter. You'll now receive updates about events, blog posts, and more from AGC Teens Church.</p>
        <p style="font-size: 1rem;">You can visit our website anytime for updates and resources.</p>
        <a href="${baseUrl}" style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#2575fc; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Visit Website</a>
        <p style="font-size: 0.95rem; color: #555; margin-top: 30px;">With love,<br><strong>AGC Akowonjo Teens Church</strong></p>
      </div>
    `;
    const text = `Hello ${email},\n\nThank you for subscribing to our newsletter. Stay tuned for updates and resources.\n\nVisit: ${baseUrl}\n\nWith love,\nAGC Akowonjo Teens Church`;
    return { subject, html, text };
  },

  // Prayer Request Template
  prayerTemplate: (name, baseUrl = 'http://localhost:4000') => {
    const subject = 'Prayer Request Received – AGC Teens Church';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #2575fc;">${subject}</h2>
        <p style="font-size: 1rem;">Hi ${name},</p>
        <p style="font-size: 1rem;">We’ve received your prayer request. Our team will be praying alongside you, and we trust God for His intervention.</p>
        <p style="font-size: 1rem;">Visit our website if you'd like to connect more or stay updated.</p>
        <a href="${baseUrl}" style="display:inline-block; margin-top:20px; padding:12px 24px; background-color:#2575fc; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Visit Website</a>
        <p style="font-size: 0.95rem; color: #555; margin-top: 30px;">With love,<br><strong>AGC Akowonjo Teens Church</strong></p>
      </div>
    `;
    const text = `Hi ${name},\n\nWe’ve received your prayer request. Our team will be praying alongside you.\n\nVisit: ${baseUrl}\n\nWith love,\nAGC Akowonjo Teens Church`;
    return { subject, html, text };
  }
};
