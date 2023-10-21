const nodemailer = require('nodemailer');
const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'tryambsachan69@gmail.com',
      pass:'eipwhyjgwasxapjz'
    },
  });
  const mailOptions = {
    from: 'tryambsachan69@gmail.com',
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;

