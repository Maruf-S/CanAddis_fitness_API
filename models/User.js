const { Schema, model } = require("mongoose");
const moment = require("moment");
const UserSchema = new Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  profile_image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["trainer", "trainee"],
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: moment.utc().valueOf(),
  },
  bio: { type: String },
  location: {
    type: String,
  },
  age: {
    type: Number,
    default: null,
    // enum: [null, "12-17", "18-24", "25-34", "35-44", "45-54", "55+"],
  },
  gender: {
    type: String,
    enum: [null, "Male", "Female"],
  },
  weight: {
    type: Number,
  },
  phone_number: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
    default: 0,
  },
});
module.exports = model("users", UserSchema);
