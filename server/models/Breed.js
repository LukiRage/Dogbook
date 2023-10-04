const mongoose = require("mongoose");

const AdvantageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 30,
  },
  description: {
    type: String,
    required: true,
    min: 3,
    max: 500,
  },
});

const DisadvantageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 30,
  },
  description: {
    type: String,
    required: true,
    min: 3,
    max: 500,
  },
});

const ImageStatusSchema = new mongoose.Schema({
  //interactive avatar gif or static image based on dog status
  name: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
});

const BreedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  average_weight: {
    type: Number,
    required: true,
  },
  average_lifespan: {
    type: Number,
    required: true,
  },
  average_water_per_day: {
    type: Number,
    required: true,
  },
  breed_advantage: [AdvantageSchema],
  breed_disadvantage: [DisadvantageSchema],
  image_status: [ImageStatusSchema],
});

module.exports = {
  Breed: mongoose.model("Breed", BreedSchema),
  Advantage: mongoose.model("Advantage", AdvantageSchema),
  Disadvantage: mongoose.model("Disadvantage", DisadvantageSchema),
  ImageStatus: mongoose.model("ImageStatus", ImageStatusSchema),
};
