require("dotenv").config();
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const JWTSECRET = process.env.SECRET_JWT;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Auth failed!", 403);
    }
    const decodedToken = jwt.verify(token, JWTSECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
