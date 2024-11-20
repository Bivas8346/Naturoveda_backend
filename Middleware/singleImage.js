const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Image/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const uploadSingle = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("selete valid image format");
      callback(null, false);
    }
  },
});

module.exports = uploadSingle;
