const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  const conn = config.get("connectionString");
  console.log("Connection String is: ", conn);
  mongoose
    .connect(conn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`connected to db server ${conn}`))
    .catch((ex) => {
      winston.error(ex.message, ex);
    });
};
