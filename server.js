const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
dotenv.config();

const router = require("./app/router");

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONFIG SESSION
app.use(
  session({
    secret: "uneChaineDeCaracteresAleatoire",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//MIDDLEWARE

//ROUTER
app.use(router);

//LISTEN
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
