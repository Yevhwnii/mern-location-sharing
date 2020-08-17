const express = require("express");

const userController = require("../controllers/users-controller");

const router = express.Router();

// GET => /api/users => get list of all users
router.get("/", userController.getUsers);

// POST => /api/users/signup => register a new user
router.post("/signup", userController.signup);

// POST => /api/users/login => login user
router.post("/login", userController.login);

module.exports = router;
