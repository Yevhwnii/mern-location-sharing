// Package imports
const express = require("express");
const bodyParser = require("body-parser");
// Local imports
const placesRoutes = require("./routes/places-routes");
// Variables
const app = express();

// Middlewares

// Routes
app.use("/api/places", placesRoutes);

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
console.log("Server is running on port 5000");
app.listen(5000);
