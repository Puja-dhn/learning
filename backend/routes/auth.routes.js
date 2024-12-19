const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", authController.login);
router.post("/refreshtoken", authController.refreshToken);

router.post("/logout", authController.logout);
router.post("/logoutConcurrentLogin", authController.logoutConcurrentLogin);

router.post("/requestotp", authController.requestotp);
router.post("/password-update", authController.passwordUpdate);
module.exports = router;
