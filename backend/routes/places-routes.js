const express = require("express");

const placeController = require("../controllers/places-controller");

const router = express.Router();

// GET => /api/places/user/:pid => get list of places for user
router.get("/user/:userId", placeController.getPlacesByUserId);

// GET => /api/places/:pid => get list of all places
router.get("/:placeId", placeController.getPlaceById);

// POST => /api/place/:pid => create new place
router.post("/", placeController.createPlace);

// PATCH => /api/place/:pid => update place
router.patch("/:placeId", placeController.updatePlace);

// DELETE => /api/place/:pid => delete place
router.delete("/:placeId", placeController.deletePlace);

module.exports = router;
