const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const commonMiddleware = require("../middlewares/common.middleware");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const accessRoutes = require("./access.routes");
const commonRoutes = require("./common.routes");
const aectRoutes = require("./aect.routes");


router.use("/auth", commonMiddleware, authRoutes);
router.use("/access", commonMiddleware, authMiddleware, accessRoutes);
router.use("/common", commonMiddleware, authMiddleware, commonRoutes);
router.use("/user", commonMiddleware, authMiddleware, userRoutes);
router.use("/aect", commonMiddleware, authMiddleware, aectRoutes);


// profile upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/images/profile");
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename || "temp.JPG";
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".JPG" && ext !== ".jpeg") {
      return callback(new Error("Only JPG are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

router.post("/uploadprofile", upload.single("file"), function (req, res) {
  res.status(200).json("success");
});

// logo image upload

const AppLogostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/images/logo");
  },
  filename: function (req, file, cb) {
    const filename = req.body.filename || "app_logo.JPG";
    cb(null, filename);
  },
});

const logoUpload = multer({
  storage: AppLogostorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".PNG"
    ) {
      return callback(new Error("Only png & JPG are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

router.post("/uploadlogo", logoUpload.single("file"), function (req, res) {
  res.status(200).json("success");
});

module.exports = router;
