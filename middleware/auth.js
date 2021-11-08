const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/auth");

module.exports = async function auth(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied, No token provided");
    const decoded = jwt.verify(token, config.get("jwt_PK"));
    const data = await User.findById(decoded._id).select(
      "name email confirmed isAdmin adminAt"
    );
    if (!data) return res.status(401).send("Unauthorized Request");
    if (!data.confirmed) return res.status(401).send("Email Not confirmed");
    // if (!data.phoneConfirmed)
    //   return res.status(401).send("Mobile Not Confirmed");
    req.user = data;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
