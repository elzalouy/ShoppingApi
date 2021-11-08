const nodemailer = require("nodemailer");
const config = require("config");
const username = config.get("Mail_UserName");
const password = config.get("Mail_Password");
const transporter = nodemailer.createTransport(
  `smtps://${username}:${password}@smtp.gmail.com`
);

module.exports = { transporter: transporter };
