const dataMapper = require("../dataMapper");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {
  //REGISTER
  createAccount: async (req, res) => {
    const postedUser = req.body;

    if (postedUser.password === postedUser.passwordConfirm)
      try {
        const hashedPass = await bcrypt.hash(postedUser.password, saltRounds);
        postedUser.password = hashedPass;
        const createdUser = await dataMapper.registerUser(postedUser);
        if (createdUser != false) {
          console.log("usercréé");
          res.json(createdUser);
        } else if (createdUser == false) {
          console.log("utilisateur existant");
        }
      } catch (error) {
        console.trace(error);
      }
  },

  //LOGIN
  getLogin: async (req, res) => {
    const loggedUser = req.body;
    try {
      const user = await dataMapper.getUser(loggedUser.email);
      if (user) {
        const matchPassword = await bcrypt.compare(
          loggedUser.password,
          user.password
        );
        if (!matchPassword) {
          res.render("loginPage", {
            error: "Utilisateur ou mot de passe incorrect",
          });
        } else {
          req.session.user = user;
          delete req.session.user.password;
          console.log(req.session.user);
          res.redirect("/");
        }
      } else {
        res.render("loginPage", {
          error: "Utilisateur ou mot de passe incorrect",
        });
      }
    } catch (error) {
      console.trace(error);
    }
    //res.render("register");
  },
};

module.exports = userController;
