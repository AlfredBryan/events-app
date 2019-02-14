const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/user");
const eventsRouter = require("./routes/event");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cors());

// Add routes
app.use("/api", userRouter);
app.use("/api", eventsRouter);

app.get("*", (req, res) => {
  res.status(200).send({
    message: "Welcome to Base route"
  });
});

app.use(function(err, req, res, next) {
  res.status(400).send(err);
});

module.exports = app;
