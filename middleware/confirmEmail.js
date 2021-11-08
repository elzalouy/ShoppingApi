const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/auth");

module.exports = async function verify(req, res, next) {
  const token = req.params.token;
  const decoded = jwt.verify(token, config.get("jwt_PK"));
  if (decoded) {
    console.log(decoded._id);
    let data = await User.findById(decoded._id);
    if (!data) return res.status(400).send("Bad Request");
    data = await User.findByIdAndUpdate(
      decoded._id,
      { confirmed: true },
      { new: true }
    ).select("name email confirmed isAdmin");
    req.user = data;
    next();
  } else {
    return res.status(400).send("Bad Request");
  }
};
