const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from cookie instead of header
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
// This middleware checks for a JWT token in the Authorization header, verifies it, and attaches the user information to the request object.
// If the token is missing or invalid, it responds with a 401 Unauthorized status and an error message.