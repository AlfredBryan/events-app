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
    // comfirm user typed the same password
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error("Passwords do not match.");
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);

    let { firstName, lastName, email } = req.body;
    let errors = [];

    // Validate Fields
    if (!firstName) {
      errors.push({ text: "Please enter first name" });
    }
    if (!lastName) {
      errors.push({ text: "Please enter last name" });
    }
    if (!email) {
      errors.push({ text: "Please enter email" });
    }

    if (errors.length > 0) {
      res.send(errors);
    } else {
      models.User.create({
        firstName,
        lastName,
        email,
        password: hashPassword
      }).then(handleResponse(res), handleError(res));
    }
  }
);

// User login route
router.post("/user/login", (req, res) => {
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
          token: null,
          reason: "Invalid Password!"
        });
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res
        .status(200)
        .cookie("token", token)
        .send({ auth: true, token: token })
        
    })
    .catch(error => {
      res.status(500).send("Error :" + error);
    });
});

// Only let the user access the route if they are authenticated.
function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

module.exports = router;
