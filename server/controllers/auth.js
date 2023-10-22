const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  
  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(200).send({
      message: "User Created Successfully"
    });

  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  async function sendMail(receiver){
   
         transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user:'tryambsachan69@gmail.com',
            pass:'eipwhyjgwasxapjz'
          },
        });
   

    const mailOptions={
        from:'tryambsachan69@gmail.com',
        to:receiver,
        subject:'Welcome to NodeJS App',
        text:'This is sample email',
    }

    try{
      const result = await transporter.sendMail(mailOptions);
      return next(new ErrorResponse('Okay', 400));
    }catch(error){
        return next(new ErrorResponse('error sending', 400));
    }

}
sendMail('abcd456plo@gmail.com')
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );
    res.status(200).send({
      message: "Login Successful",
      email: user.email,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      next(new ErrorResponse('Email cannot be sent', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `mern-login-iota.vercel.app/passwordreset/${resetToken}`;
    const message = `<h1>You have requested a password reset</h1><p>Please go to this link to reset your password</p><a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        text: message,
      });
      res.status(200).json({ success: true, data: `${email}` });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      next(new ErrorResponse('Email cannot be sent', 404));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse('Invalid reset token', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: 'Password reset success',
    });
  } catch (error) {
    next(error);
  }
};
