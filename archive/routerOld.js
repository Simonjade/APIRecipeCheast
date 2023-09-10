const express = require("express");
const router = express.Router();
const mainController = require("./controller/mainController.js");
const userController = require("./controller/userController.js");
const recipeController = require("./controller/recipeController.js");
const groupController = require("./controller/groupController.js");

//REGISTER
router.post("/register", userController.createAccount);

//LOGIN
router.post("/login", userController.getLogin);

// USER INFORMATION
// router.get("/user/:userPseudo", userController.getOneUser)
// router.patch ("/user/:UserId", userController.updateUserInfo)
router.get("/user/:userPseudo/group", groupController.getAllUserGroup);
router.get("/user/:userPseudo/recipe", recipeController.getAllUserRecipe);

//RECIPE CRUD
router.post("/recipe", recipeController.createRecipe);
// router.patch("/recipe/:recipeId", recipeController.updateRecipe)
router.delete("/recipe/:recipeId", recipeController.deleteRecipe);
router.get("/recipe/:recipeId", recipeController.getOneRecipe);

router.get("/recipe/:groupId", recipeController.getAllGroupRecipe);
router.patch("/recipe/:recipeId/:groupId", recipeController.addRecipeToGroup);

//GROUP CRUD
router.get("/group/:groupId", groupController.getOneGroup);
router.post("/group", groupController.createGroup);
router.post("/group/:groupId/:userPseudo", groupController.addUserToGroup);
router.delete("/group/:groupId/:userPseudo", groupController.deleteUserToGroup);

module.exports = router;
