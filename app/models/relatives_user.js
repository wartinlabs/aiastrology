const mongoose = require("mongoose");

const relativesUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    date_of_birth: {
      type: Date,
    },
    time_of_birth: {
      type: String,
    },
    place_of_birth: {
      type: String,
    },
    country: {
      type: String,
    },
    rashi: {
      type: Object,
    },
    day: { type: Number },
    hour: { type: Number },
    lat: { type: Number },
    lon: { type: Number },
    min: { type: Number },
    month: { type: Number },
    year: { type: Number },
    tzone: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const RelativesUser = mongoose.model("relative_users", relativesUserSchema);
module.exports = RelativesUser;
