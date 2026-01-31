const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log("DEBUG: protect middleware hit from:", req.originalUrl);
  // Read token from Cookies instead of headers
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verifying Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetching User From Token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not Authorized, User Not Found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not Authorized, Token Failed' });
    }
  } else {
    // If No Token Is Found In Cookies
    return res.status(401).json({ message: 'Not Authorized, No Token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// This middleware checks for a token but DOES NOT return an error if it's missing.
// Useful for pages that need to know IF a user is logged in but are also public.
const optionalProtect = async (req, res, next) => {
  console.log("DEBUG: optionalProtect middleware reached");
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log("DEBUG: User found in token:", req.user?._id);
    } catch (error) {
      console.log("DEBUG: Token verification failed");
      req.user = null;
    }
  } else {
    console.log("DEBUG: No token found in cookies");
  }
  next();
};

module.exports = { protect, optionalProtect, authorize };