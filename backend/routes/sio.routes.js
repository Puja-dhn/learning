const express = require("express");
const sioController = require("../controllers/sio/sio.controller");
const router = express.Router();

// router.post("/add-new-aect", aectController.addNewAectData);
// router.post("/udpate-aect-status", aectController.updateAectStatus);

// router.post("/get-aect-pending", aectController.getAECTPendingClosureData);
// router.post("/get-dashboard-data", aectController.getAECTDashboardData);
router.post("/get-sio-master-data", sioController.getSIOMasterData);
router.post("/add-new-sio", sioController.addNewSIOData);
router.post("/get-sio-data", sioController.getSioData);
router.post("/get-opensio-data", sioController.getOpenSioData);

module.exports = router;
