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
    res.status(200).send(data);
  };
}

function handleError(res) {
  return function(error) {
    console.log(error);
    res.status(200).send(data);
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

    let { fullName, email } = req.body;
    let errors = [];

    // Validate Fields
    if (!fullName) {
      errors.push({ text: "Please enter fullname" });
    }
    if (!email) {
      errors.push({ text: "Please enter email" });
    }

    if (errors.length > 0) {
      res.send(errors);
    } else {
      models.User.create(
        {
          fullName,
          email,
          password: hashPassword
        },
        (err, user) => {
          if (err) res.status(409).send({ message: err.message });

          //create token
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });
          res
            .status(200)
            .cookie("token", token)
            .send({ auth: true, token: token, user: user });
        }
      );
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
        .send({ auth: true, token: token, user: user });
    })
    .catch(error => {
      res.status(500).send("Error :" + error);
    });
});

module.exports = router;
