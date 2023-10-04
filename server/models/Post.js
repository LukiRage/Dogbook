const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      reqired: true,
    },
    description: {
      type: String,
      max: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = {
  Post: mongoose.model("Post", PostSchema),
  Comment: mongoose.model("Comment", CommentSchema),
};
