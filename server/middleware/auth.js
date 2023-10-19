const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const decoded = jwt.verify(token, "4e7f92ca7ac87d9d3aa0d010ad33c73394b8bb131e0f7e01d8199b0e2bb2e4b1");
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
