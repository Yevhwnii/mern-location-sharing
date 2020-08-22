const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    // Exclude password from returning data, to include only few remove minus sign
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Fetching users failed", 500));
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Signing up failed, internal error", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead", 422)
    );
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Saving new user failed", 500));
  }
  res.status(201).json({
    message: "User has been created",
    user: newUser.toObject({ getters: true }),
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Loggin in failed, internal error", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Invalid credentials", 422));
  }

  res.json({
    message: "Logged In",
    user: existingUser.toObject({ getters: true }),
  });
};
