const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Breiter",
    email: "test@test.com",
    password: "123123",
  },
];

exports.getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    throw new HttpError("Invalid inputs passed", 422);
  }
  const { name, email, password } = req.body;

  const userExists = DUMMY_USERS.find((u) => u.email === email);
  if (userExists) {
    throw new HttpError("Email has already been taken", 422);
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  res.status(201).json({ message: "User has been created", user: newUser });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = DUMMY_USERS.find((u) => u.email === email);
  console.log(foundUser);
  if (!foundUser || foundUser.password !== password) {
    throw new HttpError("No user with such email or password is invalid", 401);
  }
  res.json({ message: "Logged In" });
};
