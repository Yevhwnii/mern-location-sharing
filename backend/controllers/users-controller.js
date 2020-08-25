require("dotenv").config();

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const JWTSECRET = process.env.SECRET_JWT;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Saving new user failed", 500));
  }

  let token;
  token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWTSECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({
    message: "User has been created",
    token,
    userId: newUser.id,
    email: newUser.email,
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

  if (!existingUser) {
    return next(new HttpError("Invalid credentials", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Login failed", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials", 422));
  }

  let token;
  token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    JWTSECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    message: "Logged In",
    token,
    userId: existingUser.id,
    email: existingUser.email,
  });
};
