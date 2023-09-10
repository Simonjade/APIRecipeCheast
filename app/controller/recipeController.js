const { recipeDatamapper } = require("../model");

const recipeController = {
  getOneRecipe: async (req, res, next) => {
    const recipeId = req.params.recipeId;
    const { error, result } = await recipeDatamapper.getOneRecipe(recipeId);
    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },

  getAllUserRecipe: async (req, res) => {
    const pseudo = req.params.userPseudo;
    const { error, result } = await recipeDatamapper.getUserRecipe(pseudo);
    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },

  getAllGroupRecipe: async (req, res) => {
    const id = req.params.groupId;
    const { error, result } = await recipeDatamapper.getGroupRecipe(id);
    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },

  createRecipe: async (req, res) => {
    const recipe = req.body;
    const { error, result } = await recipeDatamapper.insertRecipe(recipe);
    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },

  deleteRecipe: async (req, res) => {
    const recipeId = req.params.recipeId;
    const { error, result } = await recipeDatamapper.deleteRecipe(recipeId);

    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },

  addRecipeToGroup: async (req, res) => {
    const recipeId = req.params.recipeId;
    const groupId = req.params.groupId;
    const { error, result } = await recipeDatamapper.addRecipeinGroup(
      groupId,
      recipeId
    );
    if (error) {
      next(error);
    } else {
      res.status(200).json(result);
    }
  },
};

module.exports = recipeController;
