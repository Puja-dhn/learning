const express = require("express");
const sioController = require("../controllers/sio/sio.controller");
const router = express.Router();

router.post("/get-sio-master-data", sioController.getSIOMasterData);
router.post("/add-new-sio", sioController.addNewSIOData);
router.post("/get-sio-data", sioController.getSioData);
router.post("/get-opensio-data", sioController.getOpenSioData);
router.post("/submit-pdcassign-data", sioController.submitPDCAssign);
router.post("/get-assignedsio-data", sioController.getAssignedSioData);
router.post("/submit-action-taken", sioController.submitActionTaken);

module.exports = router;
