const express = require("express");
const { body } = require("express-validator");

const placeController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// GET => /api/places/user/:pid => get list of places for user
router.get("/user/:userId", placeController.getPlacesByUserId);

// GET => /api/places/:pid => get list of all places
router.get("/:placeId", placeController.getPlaceById);

// POST => /api/place/:pid => create new place
router.post(
  "/",
  fileUpload.single("image"),
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("address").notEmpty(),
  ],
  placeController.createPlace
);

// PATCH => /api/place/:pid => update place
router.patch(
  "/:placeId",
  [body("title").notEmpty(), body("description").isLength({ min: 5 })],
  placeController.updatePlace
);

// DELETE => /api/place/:pid => delete place
router.delete("/:placeId", placeController.deletePlace);

module.exports = router;
