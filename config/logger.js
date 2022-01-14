const winston = require("winston");
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "log/combined.log",
    }),
    new winston.transports.Console(),
  ],
});

module.exports = {
    logger:logger
}
