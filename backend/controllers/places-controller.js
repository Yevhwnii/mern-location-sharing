const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
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

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find requested places for such user id", 404)
    );
  }
  res.json({ places });
};

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    return next(
      new HttpError("Could not find requested place for such place id", 404)
    );
  }
  res.json({ place });
};

exports.createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res
    .status(200)
    .json({ message: "Place successfuly created", place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const placeToUpdate = DUMMY_PLACES.find((p) => p.id === placeId);
  const placeToUpdateIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  const updatedPlace = {
    ...placeToUpdate,
    title,
    description,
  };

  DUMMY_PLACES[placeToUpdateIndex] = updatedPlace;

  res.status(200).json({ message: "Place updated!", place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;

  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find place for such id", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Place deleted" });
};
