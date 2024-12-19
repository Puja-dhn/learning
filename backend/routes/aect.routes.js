const express = require("express");
const aectController = require("../controllers/aect/aect.controller");
const router = express.Router();

router.post("/add-new-aect", aectController.addNewAectData);
router.post("/udpate-aect-status", aectController.updateAectStatus);
router.post("/get-aect-data", aectController.getAectData);
router.post("/get-aect-pending", aectController.getAECTPendingClosureData);
router.post("/get-dashboard-data", aectController.getAECTDashboardData);


module.exports = router;
