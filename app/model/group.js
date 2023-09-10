const client = require("../service/dbPool");

const groupdataMapper = {
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
};

module.exports = groupdataMapper;
