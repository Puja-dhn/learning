const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mail.js");

const transporter = nodemailer.createTransport({
  ...mailConfig,
});

exports.sendMail = async (to, cc, subject, html) => {
  const info = await transporter.sendMail({
    from: '"EHS Atomberg" <no-reply-EHS@atomberg.co.in>',
    to,
    cc,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};
