const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isOnline: {
      //na isOnline
      type: Boolean,
      default: false,
    },
    description: {
      //desc
      type: String,
      max: 50,
    },
    currentLocation: {
      //city
      type: String,
      max: 50,
    },
    homeLocation: {
      //from
      type: String,
      max: 50,
    },
    relationshipStatus: {
      //relationship
      type: Number,
      enum: [1, 2, 3],
    },
    guestArr: {
      //array to store registered guests id
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
