const client = require("./database");

const dataMapper = {
  async registerUser(obj) {
    const query = {
      text: `
        INSERT INTO "user" (email, password, pseudo) VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
    `,

      values: [obj.email, obj.password, obj.pseudo],
    };

    const result = await client.query(query);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      console.log("Utilisateur créé avec succès");
      return user;
    } else {
      console.log("Utilisateur déjà existant");
      return false;
    }
  },

  async findOneGroup(id) {
    const query = {
      text: `SELECT * FROM "group" WHERE id=$1;`,
      values: [id],
    };
    const result = await client.query(query);
    return result.rows[0];
  },

  async getGroupUsers(pseudo) {
    const query = {
      text: `SELECT "group".* FROM "group" JOIN user_has_group ON "group".id = group_id WHERE user_has_group.user_id=(SELECT id FROM "user" WHERE pseudo=$1);`,
      values: [pseudo],
    };
    const result = await client.query(query);
    return result.rows;
  },

  async createGroup(obj) {
    const query = {
      text: `INSERT INTO "group" (name, description) VALUES ($1, $2) RETURNING *;`,
      values: [obj.name, obj.description],
    };
    const result = await client.query(query);
    console.log(result);
    if (result.rowCount > 0) {
      const newGroup = result.rows[0];
      console.log("Groupe créé");
      console.log(newGroup);
      return newGroup;
    }
  },

  async insertUserinGroup(pseudo, id) {
    const query = {
      text: `INSERT INTO user_has_group (user_id, group_id) VALUES ((SELECT id FROM "user" WHERE pseudo=$1), $2);`,
      values: [pseudo, id],
    };
    const result = await client.query(query);
    if (result.rowCount > 0) {
      console.log("utilisateur ajouté au group");
    }
  },

  async deleteUserinGroup(pseudo, id) {
    const query = {
      text: `DELETE FROM user_has_group WHERE user_id=(SELECT id FROM "user" WHERE pseudo=$1) AND group_id=$2`,
      values: [pseudo, id],
    };
    const result = await client.query(query);
    if (result.rowCount > 0) {
      console.log("utilisateur enlevé du group");
    }
  },

  async getUser(email) {
    const query = {
      text: `SELECT * FROM "user" WHERE email=$1`,
      values: [email],
    };

    const result = await client.query(query);
    return result.rows[0];
  },

  async deleteRecipe(id) {
    const query = {
      text: `DELETE FROM recipe WHERE id=$1;`,
      values: [id],
    };
    const result = await client.query(query);
    if (result.rowCount > 0) {
      console.log("la recette a été supprimée");
    }
  },

  async insertRecipe(obj) {
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
      return { success: true };
    } catch (error) {
      await client.query("ROLLBACK"); // Annuler la transaction en cas d'erreur
      throw error;
    }
  },

  async getOneRecipe(id) {
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
      WHERE recipe.id=$1
      GROUP BY recipe.id`,
      values: [id],
    };
    const result = await client.query(query);
    return result.rows[0];
  },

  async getUserRecipe(pseudo) {
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
      WHERE recipe.user_id=(SELECT id FROM "user" WHERE pseudo=$1)
      GROUP BY recipe.id`,
      values: [pseudo],
    };
    const result = await client.query(query);
    return result.rows;
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
    const result = await client.query(query);
    return result.rows;
  },

  async addRecipeinGroup(groupId, userId) {
    const query = {
      text: `INSERT INTO group_has_recipe (group_id, recipe_id) VALUES ($1, $2);`,
      values: [groupId, userId],
    };
    const result = await client.query(query);
    if (result.rowCount > 0) {
      console.log("recette partagée avec le groupe");
    }
  },
};

module.exports = dataMapper;
