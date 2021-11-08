const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const path = require("path");
let dir = __dirname.split("/utils");
module.exports = function () {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(dir[0], "/public"));
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");
      cb(null, uuid4() + "-" + Date.now() + "-" + fileName);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  });
  return upload;
};
