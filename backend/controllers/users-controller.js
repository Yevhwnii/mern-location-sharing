const { v4: uuidv4 } = require("uuid");

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
  const { name, email, password } = req.body;

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
  if (!foundUser || foundUser.passowrd !== password) {
    throw new HttpError("No user with such email or password is invalid", 401);
  }
  res.json({ message: "Logged In" });
};
