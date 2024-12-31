const express = require('express');
const contextdefinitionController = require("../controllers/master/contextdefinition.controller");
const orgstructureController = require("../controllers/master/orgstructure.controller");
const router = express.Router();

// contextdefinition routes
router.post("/get-context", contextdefinitionController.getContextDefinitions);
router.post("/get-context-by-id", contextdefinitionController.getContextDefinitionById);
router.post("/add-context", contextdefinitionController.createContextDefinition);
router.post("/update-context", contextdefinitionController.updateContextDefinition);
router.post("/delete-context", contextdefinitionController.deleteContextDefinition);


// orgstructure routes
router.post("/get-orgstructure", orgstructureController.getOrgStructure);
router.post("/get-orgstructure-by-id", orgstructureController.getOrgStructureById);
router.post("/add-orgstructure", orgstructureController.createOrgStructure);
router.post("/update-orgstructure", orgstructureController.updateOrgStructure);
router.post("/delete-orgstructure", orgstructureController.deleteOrgStructure);
router.post("/get-users", orgstructureController.getUsers);




module.exports = router;
