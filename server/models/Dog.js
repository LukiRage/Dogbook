const mongoose = require("mongoose");
//const {Schema} = mongoose;

const ActivityDetailsSchema = new mongoose.Schema(
  {
    mins_spent: {
      type: Number,
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MealDetailsSchema = new mongoose.Schema(
  {
    mealId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DiseaseDetailSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: String,
      required: true,
    },
    day_count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const BehaviourDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    description: {
      type: String,
      required: true,
      max: 500,
    },
  },
  { timestamps: true }
);

const DogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    guestId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: Boolean,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    breedId: {
      type: String,
      required: true,
    },
    status: {
      //status ostatniej aktywności psa
      type: String,
    },
    meals: [MealDetailsSchema],
    activities: [ActivityDetailsSchema],
    diseases: [DiseaseDetailSchema],
    behaviours: [BehaviourDetailSchema],
  },
  { timestamps: true }
);

module.exports = {
  Dog: mongoose.model("Dog", DogSchema),
  ActivityDetails: mongoose.model("ActivityDetails", ActivityDetailsSchema),
  MealDetails: mongoose.model("MealDetails", MealDetailsSchema),
  DiseaseDetails: mongoose.model("DiseaseDetails", DiseaseDetailSchema),
  BehaviourDetails: mongoose.model("BehaviourDetails", BehaviourDetailSchema),
};
