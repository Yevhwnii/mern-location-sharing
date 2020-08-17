const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Famous skyscraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "Famous skyscraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u2",
  },
];

// GET => /api/places/user/:pid => get list of places for user
router.get("/user/:userId", (req, res, next) => {
  const userId = req.params.userId;

  const place = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!place) {
    return next(
      new HttpError("Could not find requested place for such user id", 404)
    );
  }
  res.json({ place });
});

// GET => /api/places/:pid => get list of all places
router.get("/:placeId", (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    return next(
      new HttpError("Could not find requested place for such place id", 404)
    );
  }
  res.json({ place });
});

module.exports = router;
