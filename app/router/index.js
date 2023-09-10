// Module de gestion d'erreur
const errorHandler = require("../service/errorHandler");

// Import des routeurs
const recipeRouter = require("./recipe");
const groupRouter = require("./group");
const userRouter = require("./user");
const loginRouter = require("./login");

// Déclaration du routeur principal
const express = require("express");
const mainRouter = express.Router();

// Aiguillage pour les routes de login
mainRouter.use(loginRouter);

// Aiguillage pour les routes préfixées par /recipe
mainRouter.use("/recipe", recipeRouter);

// Aiguillage pour les routes préfixées par /group
mainRouter.use("/group", groupRouter);

// Aiguillage pour les routes préfixées par /user
mainRouter.use("/user", userRouter);

// Middleware de gestion des urls non trouvées
mainRouter.use(errorHandler.notFound);

// Middleware de gestion d'erreur
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
