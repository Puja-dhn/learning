const express = require("express");
const commonController = require("../controllers/common.controller");
const router = express.Router();

router.get("/orgdata", commonController.orgdata);
router.get("/lineorgdata", commonController.getLineOrgData);
router.get("/ficorgdata", commonController.getFicOrgData);
router.get("/get-db-date", commonController.getDBDate);

module.exports = router;
