const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  // Index on email field which basically speeds up the query
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, ref: "Place", required: true }],
});

// Create new user only if email doesn`t exists already
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
