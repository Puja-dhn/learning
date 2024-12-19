const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;
require("winston-daily-rotate-file");

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "./logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD hh",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: process.env.NODE_LOG_LEVEL || "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [fileRotateTransport],
});

module.exports = logger;
