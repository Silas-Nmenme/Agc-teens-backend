const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Admin = require('../models/Adminschema');


module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // includes id
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
module.exports = (req, res, next) => {
  if (req.session && req.session.adminId) {
    req.user = { id: req.session.adminId }; // Set user context
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
