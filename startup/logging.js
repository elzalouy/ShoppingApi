const winston = require("winston");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "logfile.log" })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
    })
  );
};
