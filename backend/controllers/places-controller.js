const { validationResult } = require("express-validator");

const Place = require("../models/place");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  const places = await Place.find({ creator: userId });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find requested places for such user id", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  const place = await Place.findById(placeId);

  if (!place) {
    return next(
      new HttpError("Could not find requested place for such place id", 404)
    );
  }
  // Converting mongoose object to js object, leaving getters for id
  res.json({ place: place.toObject({ getters: true }) });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    creator,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(new HttpError("Creating place failed, try again", 500));
  }
  res
    .status(201)
    .json({ message: "Place successfuly created", place: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const placeToUpdate = await Place.findById(placeId);

  if (!placeToUpdate) {
    return next(new HttpError("Could not find place for requested id", 404));
  }

  placeToUpdate.title = title;
  placeToUpdate.description = description;

  try {
    await placeToUpdate.save();
  } catch (error) {
    return next(new HttpError("Could not update place", 500));
  }

  res.status(200).json({
    message: "Place updated!",
    place: placeToUpdate.toObject({ getters: true }),
  });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;

  let placeToDelete;
  try {
    placeToDelete = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Could not delete a place", 500));
  }

  try {
    await placeToDelete.remove();
  } catch (error) {
    return next(new HttpError("Could not delete a place", 500));
  }

  res.status(200).json({ message: "Place deleted" });
};
