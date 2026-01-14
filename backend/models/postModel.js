import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  text: {
    type: String,
  },

  image: {
    type: String,
  },

  likes: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
    default: [],
  },

  replies: {
    type: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        likes: {
          type: [String],
          default: [],
        },

        postedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },

  repostedBy: {
    type: [mongoose.Schema.ObjectId],
    ref: "User",
    default: [],
  },

  savedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },

  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
