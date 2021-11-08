module.exports = function admin(req, res, next) {
  if (!req.user.isAdmin) return res.status(401).send("access denied");
  next();
};
