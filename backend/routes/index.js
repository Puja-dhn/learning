const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const commonMiddleware = require("../middlewares/common.middleware");
const authRoutes = require("./auth.routes");

const accessRoutes = require("./access.routes");

const sioRoutes = require("./sio.routes");
const ptwRoutes = require("./ptw.routes");

router.use("/auth", commonMiddleware, authRoutes);
router.use("/access", commonMiddleware, authMiddleware, accessRoutes);

router.use("/sio", commonMiddleware, authMiddleware, sioRoutes);
router.use("/ptw", commonMiddleware, authMiddleware, ptwRoutes);

const AppObsImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/sioimages");
  },

  filename: function (req, file, cb) {
    const filenames = JSON.parse(req.body.filenames || "[]");
    const orginalnames = JSON.parse(req.body.orginalnames || "[]");
    if (!filenames || filenames.length === 0) {
      return cb(new Error("No filenames provided in the request"));
    }

    const fileIndex = orginalnames.findIndex((f) => f === file.originalname);
    const filename = filenames[fileIndex] || file.originalname;

    cb(null, filename);
  },
});
const obsImageUpload = multer({
  storage: AppObsImageStorage,

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".PNG"
    ) {
      return callback(new Error("Only PNG, JPG, and JPEG are allowed"));
    }

    callback(null, true);
  },

  limits: {
    fileSize: 1024 * 1024,
  },
});

router.post(
  "/uploadObsImage",

  obsImageUpload.array("files[]", 100),

  function (req, res) {
    res.status(200).json("success");
  },
  function (err, req, res, next) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 1 MB" });
    } else if (err.message === "Only PNG, JPG, and JPEG are allowed") {
      return res.status(400).json({
        error: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
      });
    }
    res.status(400).json({ error: err.message });
  }
);
router.post(
  "/uploadObsClosureImage",

  obsImageUpload.array("files[]", 100),

  function (req, res) {
    res.status(200).json("success");
  },
  function (err, req, res, next) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 1 MB" });
    } else if (err.message === "Only PNG, JPG, and JPEG are allowed") {
      return res.status(400).json({
        error: "Invalid file type. Only PNG, JPG, and JPEG are allowed.",
      });
    }
    res.status(400).json({ error: err.message });
  }
);

router.post("/deleteObsImage", (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join("static/api/sioimages", imageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting image" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  });
});

router.post("/deleteObsClosureImage", (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join("static/api/sioimages", imageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting image" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  });
});

module.exports = router;
