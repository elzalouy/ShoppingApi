const winston = require("winston");
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.log(err);
      if (err.code === 11000) res.status(400).send("duplicated name");
      winston.error(err.message, err);
      res.status(500).send(err.message);
    }
  };
};
