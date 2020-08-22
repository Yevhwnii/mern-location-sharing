const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// GET => /api/users => get list of all users
router.get("/", userController.getUsers);

// POST => /api/users/signup => register a new user
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    body("name").notEmpty(),
    body("email").normalizeEmail().isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  userController.signup
);

// POST => /api/users/login => login user
router.post("/login", userController.login);

module.exports = router;
