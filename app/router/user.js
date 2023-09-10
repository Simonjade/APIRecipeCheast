// Déclaration du routeur "user"
// sous-entendu, mon URL est préfixée par /user
const express = require("express");
const router = express.Router();

// Import du controller
const { userController } = require("../controller");
const { groupController } = require("../controller");
const { recipeController } = require("../controller");

//Import du service de validation
const validationService = require("../service/validation/validationService");

//TODO - AJOUTER DOC SWAGGER
// USER INFORMATION
// router.get("/:userPseudo", userController.getOneUser)
// router.patch ("/:id", userController.update)
router.get("/:userPseudo/group", groupController.getAllUserGroup);
router.get("/:userPseudo/recipe", recipeController.getAllUserRecipe);
router.post("/", userController.register);
router.patch(
  "/:id(\\d+)",
  validationService.isConnected,
  userController.modifyOne
);
router.delete(
  "/:id(\\d+)",
  validationService.isConnected,
  userController.deleteOne
);

module.exports = router;
