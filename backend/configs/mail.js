module.exports = {
  host: process.env.NODE_SMTP_IP,
  port: process.env.NODE_SMTP_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false, // do not fail on invalid certs
  },
};
