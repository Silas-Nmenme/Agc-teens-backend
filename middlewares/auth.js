// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Adminschema');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ error: 'Invalid token' });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
