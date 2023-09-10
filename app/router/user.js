// Déclaration du routeur "user"
// sous-entendu, mon URL est préfixée par /user
const express = require("express");
const router = express.Router();

// Import du controller
const { userController } = require("../controller");
const { groupController } = require("../controller");
const { recipeController } = require("../controller");

// Import du service de validation
//const validationService = require("../service/validationService");

//TODO - AJOUTER DOC SWAGGER
// USER INFORMATION
// router.get("/:userPseudo", userController.getOneUser)
// router.patch ("/:UserPseudo", userController.updateUserInfo)
router.get("/:userPseudo/group", groupController.getAllUserGroup);
router.get("/:userPseudo/recipe", recipeController.getAllUserRecipe);

module.exports = router;
