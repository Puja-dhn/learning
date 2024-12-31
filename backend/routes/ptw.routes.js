const express = require("express");
const ptwController = require("../controllers/ptw/ptw.controller");
const ptwhtmlController = require("../controllers/ptw/ptwhtml.controller");
const router = express.Router();

router.post("/get-ptw-master-data", ptwController.getPTWMasterData);
router.post("/get-ptw-data", ptwController.getPtwData);
router.post("/get-openptw-data", ptwController.getOpenPtwData);
router.post("/submit-ptwapproval-data", ptwController.submitPTWApprovalData);
router.post("/add-new-ptw", ptwController.addNewPTWData);
router.post("/close-ptw", ptwController.closePtw);
router.post("/get-violation-master-data", ptwController.getViolationMasterData);
router.post("/add-new-violation", ptwController.addNewViolationData);
router.post("/get-violation-data", ptwController.getViolationData);
router.post("/get-openviolation-data", ptwController.getOpenViolationData);
router.post("/close-violations", ptwController.closeViolations);

// Permit Download
router.post("/get-permit-to-work", ptwhtmlController.getPermittoWork);

module.exports = router;
