const express = require("express");
const ptwController = require("../controllers/ptw/ptw.controller");
const router = express.Router();

router.post("/get-ptw-master-data", ptwController.getPTWMasterData);

module.exports = router;
