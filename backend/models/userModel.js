import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    picture: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: "New User",
      required: true,
    },

    biography: {
      type: String,
      default: "Hey there! I'm using Strings!",
      maxLength: 256,
    },

    followers: {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      default: [],
    },

    following: {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      default: [],
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
