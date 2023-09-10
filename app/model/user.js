const client = require("../service/dbPool");
const APIError = require("../service/APIError");

const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier

const userdataMapper = {
  async registerUser(obj) {
    const query = {
      text: `
          INSERT INTO "user" (email, password, pseudo) VALUES ($1, $2, $3)
          ON CONFLICT (email) DO NOTHING
          RETURNING *;
      `,

      values: [obj.email, obj.password, obj.pseudo],
    };

    let error;
    let result;

    try {
      const response = await client.query(query);
      if (response.rowCount > 0) {
        result = response.rows[0];
        debug("Utilisateur créé avec succès");
      } else {
        debug("Utilisateur déjà existant");
        return false;
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }
    return { error, result };
  },

  async getUser(email) {
    const query = {
      text: `SELECT * FROM "user" WHERE email=$1`,
      values: [email],
    };

    let result;
    let error;

    try {
      const response = await client.query(query);
      if (response.rows.length == 0) {
        error = new APIError("Aucun user n'a été trouvé", 404);
      } else {
        result = response.rows[0];
      }
    } catch (err) {
      error = new APIError("Erreur interne au serveur", 500);
    }
    return { error, result };
  },
};

module.exports = userdataMapper;
