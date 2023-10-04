const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  description: {
    type: String,
    required: true,
    max: 500,
  },
  image: {
    type: String,
  },
  members: {
    type: Array,
    default: [],
  },
  expiredIn: {
    type: Date,
    // format: DD / MM / YYYY,
  },
  startDate: {
    type: Date,
    // format: DD / MM / YYYY,
  },
});

module.exports = mongoose.model("Event", EventSchema);
