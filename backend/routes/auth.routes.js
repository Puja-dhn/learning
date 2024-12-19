const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", authController.login);
router.post("/refreshtoken", authController.refreshToken);
router.get("/alllocations", authController.alllocations);
router.post("/register-scanner", authController.registerScanner);
router.post("/getUserRfidValidate", authController.getUserRfidValidate);
router.post("/register-user", authController.registerUser);
router.post("/getuser", authController.getuser);
router.post("/get-sap-user", authController.getSapUser);
router.post("/logout", authController.logout);
router.post("/logoutConcurrentLogin", authController.logoutConcurrentLogin);

router.post("/requestotp", authController.requestotp);
router.post("/password-update", authController.passwordUpdate);
module.exports = router;
