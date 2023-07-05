const dataMapper = require("../dataMapper");

const groupController = {
  getOneGroup: async (req, res) => {
    try {
      const GroupId = parseInt(req.params.groupId);
      const group = await dataMapper.findOneGroup(GroupId);
      if (!group) {
        res.status(404).json("Cant find this group");
      } else {
        res.json(group);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
  getAllUserGroup: async (req, res) => {
    try {
      const pseudo = req.params.userPseudo;
      const allGroup = await dataMapper.getGroupUsers(pseudo);
      if (allGroup) {
        res.status(200).json(allGroup);
      } else {
        res.status(404).json("l'utilisateur n'a pas de groupes");
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
  createGroup: async (req, res) => {
    try {
      const group = req.body;

      let bodyErrors = [];
      if (!group.name) {
        bodyErrors.push(`name can not be empty`);
      }
      if (!group.description) {
        bodyErrors.push(`description can not be empty`);
      }
      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        const newGroup = await dataMapper.createGroup(group);
        res.status(200).json(newGroup);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
  addUserToGroup: async (req, res) => {
    try {
      const pseudo = req.params.userPseudo;
      const id = req.params.groupId;
      const add = await dataMapper.insertUserinGroup(pseudo, id);
      res.status(200).json(add);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  deleteUserToGroup: async (req, res) => {
    try {
      const pseudo = req.params.userPseudo;
      const id = req.params.groupId;
      const deleteted = await dataMapper.deleteUserinGroup(pseudo, id);
      res.status(200).json(deleteted);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
};

module.exports = groupController;
