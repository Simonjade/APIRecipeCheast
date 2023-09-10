const { userDatamapper } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

//CLASS FOR ERROR
const APIError = require("../service/APIError");

const userController = {
  register: async (req, res) => {
    const postedUser = req.body;

    if (postedUser.password === postedUser.passwordConfirm)
      try {
        const hashedPass = await bcrypt.hash(postedUser.password, saltRounds);
        postedUser.password = hashedPass;
        const createdUser = await userDatamapper.addOne(postedUser);
        if (createdUser != false) {
          res.json(createdUser);
        } else if (createdUser == false) {
          const err = new APIError("Utilisateur existant", 409);
        }
      } catch (error) {
        console.trace(error);
      }
  },

  async login(req, res, next) {
    const { error, result } = await userDatamapper.checkUser(req.body);

    if (error) {
      next(error);
    } else {
      if (result) {
        const match = await bcrypt.compare(req.body.password, result.password);
        if (match) {
          delete result.password;
          delete result.email;
          const token = jwt.sign(
            {
              user: result,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "2 hours",
            }
          );
          res.json({
            logged: true,
            id: result.id,
            token: token,
          });
        } else {
          const err = new APIError("Mot de passe ou mail incorrect", 400);
          next(err);
        }
      } else {
        const err = new APIError("Mot de passe ou mail incorrect", 400);
        next(err);
      }
    }
  },

  async modifyOne(req, res, next) {
    const user = req.body;
    if (req.user.id == req.params.id) {
      const { error, result } = await userDatamapper.modifyOne(user);

      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },

  async deleteOne(req, res, next) {
    if (req.user.id == req.params.id) {
      const { error, result } = await userDatamapper.deleteOne(req.params.id);
      if (error) {
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Acces denied", 404);
      next(err);
    }
  },
};

module.exports = userController;
