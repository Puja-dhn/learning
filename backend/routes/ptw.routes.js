const express = require("express");
const ptwController = require("../controllers/ptw/ptw.controller");
const router = express.Router();

router.post("/get-ptw-master-data", ptwController.getPTWMasterData);
router.post("/get-ptw-data", ptwController.getPtwData);
router.post("/get-openptw-data", ptwController.getOpenPtwData);

module.exports = router;
