const express = require("express");
const bcrypt = require("bcrypt");
const { check } = require("express-validator/check");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const models = require("../models/index");

const router = express.Router();

function handleResponse(res) {
  return function(data) {
    console.log(data);
    res.send(data);
  };
}

function handleError(res) {
  return function(error) {
    console.log(error);
    res.send(error);
  };
}

// List All Users
router.get("/users/all", (req, res) => {
  models.User.findAll({}).then(handleResponse(res), handleError(res));
});

// User signup with hashed password
router.post(
  "/user/register",
  [
    check("email")
      .isEmail()
      .normalizeEmail(),
    check("password")
      .isLength({ min: 7 })
      .trim()
  ],
  (req, res) => {
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    models.User.create({
      email: req.body.email,
      password: hashPassword
    }).then(handleResponse(res), handleError(res));
  }
);

// User login route
router.post(
  "/user/login",
  [
    check("email")
      .isEmail()
      .normalizeEmail(),
    check("password")
      .isLength({ min: 7, max: 20 })
      .trim()
  ],
  (req, res) => {
    models.User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          return res.status(404).send("User Not Found");
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            auth: false,
            accessToken: null,
            reason: "Invalid Password!"
          });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, accessToken: token });
      })
      .catch(error => {
        res.status(500).send("Error :" + error);
      });
  }
);

// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

module.exports = router;
