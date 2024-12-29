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
router.post(
  "/get-ims-categorization-data",
  imsController.getImsCategorizationData
);
router.post("/submit-incident-category", imsController.submitIncidentCategory);
router.post(
  "/get-ims-investigation-data",
  imsController.getImsInvestigationData
);
router.post(
  "/submit-investigation-data",
  imsController.submitInvestigationData
);
router.post("/get-recommendation-data", imsController.getRecommendationData);
router.post("/close-recommendation", imsController.closeRecommendation);

module.exports = router;
