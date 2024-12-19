const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const commonMiddleware = require("../middlewares/common.middleware");
const authRoutes = require("./auth.routes");

const accessRoutes = require("./access.routes");

const sioRoutes = require("./sio.routes");

router.use("/auth", commonMiddleware, authRoutes);
router.use("/access", commonMiddleware, authMiddleware, accessRoutes);

router.use("/sio", commonMiddleware, authMiddleware, sioRoutes);

module.exports = router;
