const express = require("express");

const placeController = require("../controllers/places-controller");

const router = express.Router();

// GET => /api/places/user/:pid => get list of places for user
router.get("/user/:userId", placeController.getPlaceByUserId);

// GET => /api/places/:pid => get list of all places
router.get("/:placeId", placeController.getPlaceById);

module.exports = router;
