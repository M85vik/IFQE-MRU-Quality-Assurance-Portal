const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Read token from Cookies instead of headers
  const token = req.cookies.jwt;

  if(token){
    try {
      // Verifying Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetching User From Token
      req.user = await User.findById(decoded.id).select('-password');

      if(!req.user){
        return res.status(401).json({message : 'Not Authorized, User Not Found'});
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({message : 'Not Authorized, Token Failed'});
    }
  } else {
    // If No Token Is Found In Cookies
    return res.status(401).json({message : 'Not Authorized, No Token'});
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

module.exports = { protect, authorize };