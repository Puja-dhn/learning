const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/get-userdb-list", userController.getUserDBList);
router.post("/get-user-details", userController.getUserDetailsList);
router.post("/udpate-user-details", userController.updateUserDetails);
router.post("/udpate-user-profile", userController.updateUserProfile);

module.exports = router;
