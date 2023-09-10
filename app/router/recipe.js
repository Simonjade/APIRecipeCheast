// Déclaration du routeur "recipe"
// sous-entendu, mon URL est préfixée par /recipe
const express = require("express");
const router = express.Router();

// Import du controller
const { recipeController } = require("../controller");

// Import du service de validation
//const validationService = require("../service/validationService");

//TODO - AJOUTER DOC SWAGGER

//RECIPE CRUD
router.post("/", recipeController.createRecipe);
// router.patch("/recipe/:recipeId", recipeController.updateRecipe)
router.delete("/:recipeId", recipeController.deleteRecipe);
router.get("/:recipeId", recipeController.getOneRecipe);

router.get("/:groupId", recipeController.getAllGroupRecipe);
router.patch("/:recipeId/:groupId", recipeController.addRecipeToGroup);

module.exports = router;
