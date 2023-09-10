// REQUIRE MODULES
const APIError = require("../APIError");
const jwt = require("jsonwebtoken");
const debug = require("debug")("validationService");

// MIDDLEWARE TO CHECK THE VALIDITY OF DATAs
const validationService = {
  isConnected(req, res, next) {
    let error;
    let decoded;
    const requestHeaders = req.headers;
    const authorizationHeader = requestHeaders.authorization;

    const authorizationInformation = authorizationHeader.split(" ");

    if (authorizationInformation.length == 2) {
      const token = authorizationInformation[1];

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        error = new APIError("Une erreur est survenue", 500, err);
        next(error);
      }
      if (JSON.stringify(decoded.user)) {
        req.user = decoded.user;
        next();
      } else {
        error = new APIError("Une erreur est survenue", 500);
        next(error);
      }
    } else {
      error = new APIError("Une erreur est survenue", 500);
      next(error);
    }
  },
};

module.exports = validationService;
