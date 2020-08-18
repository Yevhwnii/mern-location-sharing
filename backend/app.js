// Package imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// Local imports
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
// Variables
const app = express();
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(bodyParser.json());
// Routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// 404 route
app.use((req, res, next) => {
  const error = new HttpError("Could not find requested route", 404);
  throw error;
});

// Default error handler
app.use((err, req, res, next) => {
  // if response has already been sent
  if (res.headerSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "Internal server error occured" });
});
// Spinning up the server

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDb is connected");
    app.listen(5000);
    console.log("Server is running on port 5000");
  })
  .catch((err) => {
    console.log(err);
  });
