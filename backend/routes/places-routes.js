const express = require("express");
const { body } = require("express-validator");

const placeController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC ROUTES
// GET => /api/places/user/:pid => get list of places for user
router.get("/user/:userId", placeController.getPlacesByUserId);

// GET => /api/places/:pid => get list of all places
router.get("/:placeId", placeController.getPlaceById);

// PROTECTION MIDDLEWARE
router.use(checkAuth);

// PROTECTED ROUTES
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
