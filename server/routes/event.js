const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const { check } = require("express-validator/check");

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
    res.status(500).send(error);
  };
}

// Image Upload Configuration with multer and cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "events",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 200, height: 200, crop: "limit" }]
});

const parser = multer({ storage: storage }).single("image");

// List All Events
router.get("/events/all", (req, res) => {
  models.Event.findAll({}).then(handleResponse(res), handleError(res));
});

// Create New Event
router.post(
  "/events/add",
  [
    check("name")
      .isLength({ min: 10, max: 30 })
      .trim()
  ],
  parser,
  (req, res) => {
    let { name, description } = req.body;
    let errors = [];

    // Validate Fields
    if (!name) {
      errors.push({ text: "Please add a name" });
    }
    if (!description) {
      errors.push({ text: "Please add a description" });
    }

    if (errors.length > 0) {
      res.send(errors);
    } else {
      models.Event.create({
        name,
        description,
        image: req.file.url
      }).then(handleResponse(res), handleError(res));
    }
  }
);

/*router.post("/events/:id", (req, res) => {
  models.Event.findOne({ where: { id: req.params.id } }).then(event => {
    event
      .setUser({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        location: req.body.location,
        reason: req.body.reason
      })
      .then(suser => {
        console.log(suser);
      });
  });
});*/

router.post("/events/:id/:id", (req, res) => {
  models.Event.findOne({ where: { id: req.params.id } }).then(event => {
    models.User.findOne({ where: { id: req.params.id } }).then(user => {
      user
        .addEvent([event], {
          through: {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            location: req.body.location,
            reason: req.body.reason
          }
        })
        .then((err, event) => {
          if (err) res.status(500).send(err);
          res.status(201).send(event);
        });
    });
  });
});

router.get("/getevents", (req, res) => {
  models.UserEvent.findAll({
    include: [
      {
        model: models.User,
        required: true
      },
      {
        model: models.Event,
        required: true
      }
    ]
  });
});

module.exports = router;
