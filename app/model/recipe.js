const client = require("../service/dbPool");
const APIError = require("../service/APIError");

const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier

const recipedataMapper = {
  async getOneRecipe(id) {
    const query = {
      text: `SELECT recipe.id, recipe.title, 
          ARRAY_AGG(etape.description) as etape_description,
          (
            SELECT json_agg(json_build_object('quantity', quantity.number, 'name', ingredient.name))
            FROM ingredient
            JOIN quantity ON quantity.id = ingredient.quantity_id
            JOIN recipe_has_ingredient ON recipe_has_ingredient.ingredient_id = ingredient.id
            WHERE recipe_has_ingredient.recipe_id = recipe.id
          ) as ingredients
          FROM recipe 
          JOIN etape ON recipe.id=etape.recipe_id 
          WHERE recipe.id=$1
          GROUP BY recipe.id`,
      values: [id],
    };

    let result;
    let error;

    try {
      const response = await client.query(query);
      if (response.rows.length == 0) {
        error = new APIError("Aucune recette n'a été trouvé", 404);
      } else {
        result = response.rows[0];
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }

    return { error, result };
  },

  async getUserRecipe(pseudo) {
    /* SELECT recipe.id, recipe.title, 
          ARRAY_AGG(etape.description) as etape_description,
          ARRAY(
            SELECT json_build_object('quantity', quantity.number, 'name', ingredient.name)
            FROM ingredient
            JOIN quantity ON quantity.id = ingredient.quantity_id
            JOIN recipe_has_ingredient ON recipe_has_ingredient.ingredient_id = ingredient.id
            WHERE recipe_has_ingredient.recipe_id = recipe.id
            GROUP BY quantity.number, ingredient.name
          ) as ingredients 
        FROM recipe 
        JOIN etape ON recipe.id = etape.recipe_id 
        WHERE recipe.user_id=(SELECT id FROM "user" WHERE pseudo=$1)
        GROUP BY recipe.id;*/
    const query = {
      text: `SELECT recipe.id, recipe.title, 
          ARRAY_AGG(etape.description) as etape_description,
          (
            SELECT json_agg (json_build_object('quantity', quantity.number, 'name', ingredient.name))
            FROM ingredient
            JOIN quantity ON quantity.id = ingredient.quantity_id
            JOIN recipe_has_ingredient ON recipe_has_ingredient.ingredient_id = ingredient.id
            WHERE recipe_has_ingredient.recipe_id = recipe.id
          ) as ingredients
          FROM recipe 
          JOIN etape ON recipe.id=etape.recipe_id 
          WHERE recipe.user_id=(SELECT id FROM "user" WHERE pseudo=$1)
          GROUP BY recipe.id`,
      values: [pseudo],
    };

    let result;
    let error;

    try {
      const response = await client.query(query);
      if (response.rows.length == 0) {
        error = new APIError("Aucune recette n'a été trouvé", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }

    return { error, result };
  },

  async getGroupRecipe(id) {
    const query = {
      text: `SELECT recipe.id, recipe.title, 
          json_agg(etape.description) as etape_description,
          (
            SELECT json_agg(json_build_object('quantity', quantity.number, 'name', ingredient.name))
            FROM ingredient
            JOIN quantity ON quantity.id = ingredient.quantity_id
            JOIN recipe_has_ingredient ON recipe_has_ingredient.ingredient_id = ingredient.id
            WHERE recipe_has_ingredient.recipe_id = recipe.id
          ) as ingredients
          FROM recipe 
          JOIN etape ON recipe.id=etape.recipe_id 
          WHERE group.id=$1
          GROUP BY recipe.id`,
      values: [id],
    };

    let result;
    let error;

    try {
      const response = await client.query(query);
      if (response.rows.length == 0) {
        error = new APIError("Aucune recette n'a été trouvé", 404);
      } else {
        result = response.rows;
        return result;
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }

    return { error, result };
  },

  async deleteRecipe(id) {
    const query = {
      text: `DELETE FROM recipe WHERE id=$1;`,
      values: [id],
    };

    let result;
    let error;

    try {
      const response = await client.query(query);
      if (response.rowCount > 0) {
        result = "Recette suprimée";
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }

    return { error, result };
  },

  async insertRecipe(obj) {
    let result;
    let error;
    try {
      //BEGIN TRANSACTION
      await client.query("BEGIN");

      //INSERT RECIPE
      const recipeQuery = {
        text: `INSERT INTO recipe (title, user_id) VALUES ($1, 1) RETURNING id`,
        values: [obj.title],
      };
      const recipeResult = await client.query(recipeQuery);

      console.log("recette créée");

      //INSERT ETAPE WITH RECIPE ID

      const recipeId = recipeResult.rows[0].id;
      const values = obj.description_etape
        .map((description) => `(${recipeId}, '${description}')`)
        .join(",");

      const etapeQuery = {
        text: `INSERT INTO etape (recipe_id, description) VALUES ${values}`,
        values: [],
      };
      const etapeResult = await client.query(etapeQuery);

      console.log("étapes créées");

      //INSERT QUANTITY AND INGREDIENT AND RELATION TABLE
      for (let i = 0; i < obj.ingredient_quantity.length; i++) {
        //INSERT QUANTITY
        const quantityQuery = {
          text: `INSERT INTO quantity (number) VALUES ($1) RETURNING id`,
          values: [obj.ingredient_quantity[i]],
        };
        const quantityResult = await client.query(quantityQuery);
        const quantityId = quantityResult.rows[0].id;

        console.log("quantitées créées");

        //INSERT INGREDIENT
        const ingredientQuery = {
          text: `INSERT INTO ingredient (name, quantity_id) VALUES ($1, $2) RETURNING id`,
          values: [obj.ingredient_name[i], quantityId],
        };
        const ingredientResult = await client.query(ingredientQuery);
        const ingredientId = ingredientResult.rows[0].id;

        console.log("ingredients créées");

        //RELATION MANY TO MANY INGREDIENT/RECIPE
        const recipeIngredientQuery = {
          text: `INSERT INTO recipe_has_ingredient (recipe_id, ingredient_id) VALUES ($1, $2)`,
          values: [recipeId, ingredientId],
        };
        await client.query(recipeIngredientQuery);
        console.log("relation many to many");
      }
      await client.query("COMMIT");
      result = "Recette créée";
    } catch (error) {
      await client.query("ROLLBACK"); // Annuler la transaction en cas d'erreur
      error = new APIError("Erreur interne au serveur", 500);
    }
    return { error, result };
  },

  async addRecipeinGroup(groupId, userId) {
    const query = {
      text: `INSERT INTO group_has_recipe (group_id, recipe_id) VALUES ($1, $2);`,
      values: [groupId, userId],
    };
    let result;
    let error;
    try {
      const response = await client.query(query);
      if (response.rowCount > 0) {
        result = "recette partagée avec le groupe";
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }

    return { error, result };
  },
};

module.exports = recipedataMapper;
