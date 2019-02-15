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
    console.log(req.file);
    models.Event.create(
      {
        name: req.body.name,
        description: req.body.description,
        image: req.file.url
      },
      { include: models.EventSignUp }
    ).then(handleResponse(res), handleError(res));
  }
);

router.post(
  "/event/:id/signup",
  [
    check("phone")
      .isLength({ min: 11 })
      .trim()
  ],
  (req, res) => {
    models.Event.findById(req.params.id, {
      include: [{ model: models.EventSignUp }]
    }).then;
  }
);

router.post(
  "/event/signup",
  [
    check("phone")
      .isLength({ min: 11 })
      .trim()
  ],
  (req, res) => {
    models.EventSignUp.create(
      {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        location: request.body.location,
        reason: request.body.reason
      },
      { include: [Event] }
    ).then(handleResponse(res), handleError(res));
  }
);

router.post("event/:id", (req, res) => {
  models.Event.findOne({ where: { id: req.params.id } }).then(event => {
    models.EventSignUp.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      location: request.body.location,
      reason: request.body.reason
    }).then(created => {
      event.addEvent(created).then((err, res) => {
        if (err) return res.send(err);
        res.send(res);
      });
    });
  });
});

module.exports = router;
