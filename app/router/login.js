// Déclaration du routeur "login"
const express = require("express");
const router = express.Router();

// Import du controller
const { userController } = require("../controller");

// Import du service de validation
//const validationService = require("../service/validationService");

//TODO - AJOUTER DOC SWAGGER
//REGISTER
router.post("/register", userController.createAccount);

//LOGIN
router.post("/login", userController.getLogin);

module.exports = router;
