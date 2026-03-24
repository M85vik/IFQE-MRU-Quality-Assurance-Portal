const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {


  // let token;
  // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  //   try {
  //     token = req.headers.authorization.split(' ')[1];

  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //     req.user = await User.findById(decoded.id).select('-password');

  //     if (!req.user) {
  //       return res.status(401).json({ message: 'Not authorized, user not found' });
  //     }


  //     next();
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(401).json({ message: 'Not authorized, token failed' });
  //   }
  // }


  // now using cookies 

  try {

    const token = req.cookies.token;


    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }


    next();
  } catch (error) {
    // console.error(error);

     if (error.name === "TokenExpiredError") {
      logger.warn("JWT expired", {
        expiredAt: error.expiredAt,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip || ""
      });

      return res.status(401).json({
        message: "Session expired, please login again"
      });
    }


    logger.error("JWT verification failed", {
      error: error.message,
      stack: error.stack,
      url: req.originalUrl
    });

    return res.status(401).json({
      message: "Not authorized, token failed"
    });

    

  }

 
}




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