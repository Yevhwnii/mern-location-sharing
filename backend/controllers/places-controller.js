const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let userPlaces;
  try {
    userPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("Invalid user id", 422));
  }

  if (!userPlaces || userPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find requested places for such user id", 404)
    );
  }
  res.json({
    places: userPlaces.places.map((place) => place.toObject({ getters: true })),
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

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, try again", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }

  try {
    // Allows to perform simualtenious queries and undo all of them if any fails
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    // Push is moongose method which checks relationships and adds Object id
    user.places.push(createdPlace);
    await user.save({ session: session });
    // Only if code gets here, changes are applied, roll back otherwise
    await session.commitTransaction();
  } catch (error) {
    // May fail if server is down or if validation failed
    return next(new HttpError("Creating place failed, try again", 500));
  }
  res
    .status(201)
    .json({ message: "Place successfuly created", place: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
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
    placeToDelete = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(new HttpError("Could not delete a place", 500));
  }

  if (!placeToDelete) {
    return next(new HttpError("Could not find place", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await placeToDelete.remove({ session: session });
    // Reverse to push, it will remove place from user.places array
    placeToDelete.creator.places.pull(placeToDelete);
    await placeToDelete.creator.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Could not delete a place", 500));
  }

  res.status(200).json({ message: "Place deleted" });
};
