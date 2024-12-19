const nodemailer = require("nodemailer");
const mailConfig = require("../configs/mail.js");

const transporter = nodemailer.createTransport({
  ...mailConfig,
});

exports.sendMail = async (to, cc, subject, html) => {
  const info = await transporter.sendMail({
    from: '"NexSafe" <no-reply-nexsafe@tatamotors.com>',
    to,
    cc,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};
