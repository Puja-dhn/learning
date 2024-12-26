const express = require("express");
const imsController = require("../controllers/ims/ims.controller");
const router = express.Router();

router.post("/get-ims-master-data", imsController.getImsMasterData);
router.post("/add-new-ims", imsController.addNewIms);
router.post("/get-ims-data", imsController.getImsData);
router.post("/get-ims-others-data", imsController.getImsOthersData);
router.post(
  "/get-ims-teamformation-data",
  imsController.getImsTeamFormationData
);
router.post(
  "/submit-teamformnation-data",
  imsController.submitTeamFormationdata
);
router.post("/get-ims-close-data", imsController.getImsCloseData);
router.post("/close-incident", imsController.closeIncident);

module.exports = router;
