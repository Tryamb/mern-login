const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    
    const decoded = await jwt.verify(token, "RANDOM-TOKEN");
    
    const user = await decoded
    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
