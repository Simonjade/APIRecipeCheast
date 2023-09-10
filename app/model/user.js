const client = require("../service/dbPool");
const APIError = require("../service/APIError");

const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier

const userdataMapper = {
  async addOne(user) {
    const sqlQuery = `SELECT * FROM web.insert_user($1)`;
    const values = [user];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      console.log(err);
      error = new APIError("Internal server error", 500);
    }
    return { error, result };
  },

  async checkUser(user) {
    const sqlQuery = `SELECT * FROM web.check_user($1);`;
    const values = [user];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows[0].mail == null) {
        error = new APIError("Incorrect email or password", 400);
      } else {
        result = response.rows[0];
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  async deleteOne(id) {
    const sqlQuery = `SELECT * FROM web.delete_user($1);`;
    const values = [id];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows == false) {
        error = new APIError("User not found", 404);
      } else {
        result = true;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  async modifyOne(userInfo) {
    const sqlQuery = `SELECT * FROM web.update_user($1)`;
    const values = [userInfo];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows[0];
    } catch (err) {
      debug(err);
      error = new APIError("Internal error server", 500);
    }
    return { error, result };
  },
};

module.exports = userdataMapper;
