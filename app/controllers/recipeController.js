const dataMapper = require("../dataMapper");

const recipeController = {
  getOneRecipe: async (req, res) => {
    try {
      const recipeId = req.params.recipeId;
      const recipe = await dataMapper.getOneRecipe(recipeId);
      if (recipe) {
        res.status(200).json(recipe);
      } else {
        res.status(404).json("la recette n'existe pas");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  getAllUserRecipe: async (req, res) => {
    try {
      const pseudo = req.params.userPseudo;
      const allRecipe = await dataMapper.getUserRecipe(pseudo);
      if (allRecipe) {
        res.status(200).json(allRecipe);
      } else {
        res.status(404).json("l'utilisateur n'a pas de recette");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  getAllGroupRecipe: async (req, res) => {
    try {
      const id = req.params.groupId;
      const allRecipe = await dataMapper.getGroupRecipe(id);
      if (allRecipe) {
        res.status(200).json(allRecipe);
      } else {
        res.status(404).json("l'utilisateur n'a pas de recette");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  createRecipe: async (req, res) => {
    try {
      const recipe = req.body;
      const insertRecipe = await dataMapper.insertRecipe(recipe);
      res.json(insertRecipe);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const recipeId = req.params.recipeId;
      const deleteRecipe = await dataMapper.deleteRecipe(recipeId);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  addRecipeToGroup: async (req, res) => {
    try {
      const recipeId = req.params.recipeId;
      const groupId = req.params.groupId;
      const added = await dataMapper.addRecipeinGroup(groupId, recipeId);
      res.json(added);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
};

module.exports = recipeController;
