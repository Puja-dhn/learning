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
const imsRoutes = require("./ims.routes");
const userRouts = require("./user.routes");

const masterRouts = require("./master.routes");

router.use("/auth", commonMiddleware, authRoutes);
router.use("/access", commonMiddleware, authMiddleware, accessRoutes);

router.use("/sio", commonMiddleware, authMiddleware, sioRoutes);
router.use("/ptw", commonMiddleware, authMiddleware, ptwRoutes);
router.use("/ims", commonMiddleware, authMiddleware, imsRoutes);
router.use("/user", commonMiddleware, authMiddleware, userRouts);

router.use("/master", commonMiddleware, authMiddleware, masterRouts);

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

const AppImsImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/imsimages/logims");
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
const imsImageUpload = multer({
  storage: AppImsImageStorage,

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
  "/uploadImsImage",

  imsImageUpload.array("files[]", 100),

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

router.post("/deleteImsImage", (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join("static/api/imsimages/logims", imageName);

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

// profile upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/images/profile");
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

//investigation image

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/imsimages/investigation"); // Correct destination setup
  },
  filename: function (req, file, cb) {
    // Generate filename if not provided
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const originalName = file.originalname;
    const filename = req.body.filename || `${date}_${time}_${originalName}`;
    cb(null, filename); // Set the final filename
  },
});
const upload2 = multer({
  storage: storage2,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase(); // Ensure case insensitivity
    if (ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only JPG and JPEG files are allowed"));
    }
    callback(null, true); // Accept the file
  },
  limits: {
    fileSize: 1024 * 1024, // 1 MB file size limit
  },
});

// POST endpoint for investigation image upload
router.post("/uploadInvestigationImage", upload2.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    file: {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      path: req.file.path,
    },
  });
});

const AppHDImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "static/api/imsimages/hd");
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
const hdClosureImageUpload = multer({
  storage: AppHDImageStorage,

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
  "/uploadHdClosureImage",

  hdClosureImageUpload.array("files[]", 100),

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

router.post("/deleteHdClosureImage", (req, res) => {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join("static/api/imsimages/hd", imageName);

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
