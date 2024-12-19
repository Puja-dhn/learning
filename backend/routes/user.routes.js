const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/get-userdb-list", userController.getUserDBList);

router.post("/get-user-list", userController.getUserList);
router.post("/get-userteam-mapping", userController.getUserTeamMapping);

router.post("/check-valid-users", userController.checkValidUsers);
router.post("/get-teamuser-list", userController.getTeamUserList);
router.post("/get-user-details", userController.getUserDetailsList);
router.post("/udpate-user-details", userController.updateUserDetails);
router.post("/udpate-user-profile", userController.updateUserProfile);
router.post("/rectify-user-images", userController.rectifyUserImages);
router.post("/get-employee-type", userController.getEmployeeType);

router.get("/get-inactive-users", userController.getInactiveUsersList);
router.post("/activate-user", userController.activateUser);

module.exports = router;
