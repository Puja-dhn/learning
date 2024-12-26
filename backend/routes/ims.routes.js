const express = require("express");
const imsController = require("../controllers/ims/ims.controller");
const router = express.Router();

router.post("/get-ims-master-data", imsController.getImsMasterData);
router.post("/add-new-ims", imsController.addNewIms);

module.exports = router;
