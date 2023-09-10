// Déclaration du routeur "group"
// sous-entendu, mon URL est préfixée par /group
const express = require("express");
const router = express.Router();

// Import du controller
const { groupController } = require("../controller");

// Import du service de validation
//const validationService = require("../service/validationService");

//TODO - AJOUTER DOC SWAGGER

//RECIPE CRUD
router.get("/:groupId", groupController.getOneGroup);
router.post("/", groupController.createGroup);
router.post("/:groupId/:userPseudo", groupController.addUserToGroup);
router.delete("/:groupId/:userPseudo", groupController.deleteUserToGroup);

module.exports = router;
