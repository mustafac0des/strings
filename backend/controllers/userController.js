import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import setTokenCookie from "../utils/setTokenCookie.js";

const userSignUp = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters!" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters!" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    setTokenCookie(newUser._id, res);

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      picture: newUser.picture,
      biography: newUser.biography,
      followers: newUser.followers,
      following: newUser.following,
    };

    return res.status(201).json({
      newUser: userResponse,
      status: 200,
      message: "Account created successfully!",
    });
  } catch (err) {
    console.error("Error in userSignUp:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

const userSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required!" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    setTokenCookie(user._id, res);

    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      picture: user.picture,
      biography: user.biography,
      followers: user.followers,
      following: user.following,
    };

    return res.status(200).json({
      status: 200,
      message: "Signed in successfully! Redirecting...",
      user: userResponse,
    });
  } catch (err) {
    console.error("Error in userSignIn:", err.message);
    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
};

const userSignOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).json({ status: 200, message: "User signed out successfully!" });
  } catch (err) {
    console.error("Error in userSignOut:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

const userUpdate = async (req, res) => {
  const userId = req.params.id;
  const { name, biography, username, password, picture } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    if (user._id.toString() !== req.user._id.toString()) {
      throw new Error("Unauthorized");
    }

    if (username !== req.user.username) {
      const findExistingUsername = await User.findOne({ username });

      if (findExistingUsername) {
        throw new Error("Username already taken!");
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    user.name = name || user.name;
    user.picture = picture || user.picture;
    user.biography = biography || user.biography;
    user.username = username || user.username;

    await user.save();

    if (user) {
      return res.json({
        user,
        status: 200,
        message: "Account updated successfully!",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

const userProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");

    if (!user) {
      throw new Error("Something went wrong!");
    } else {
      return res.json(user);
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const userFollowUnfollow = async (req, res) => {
  try {
    const otherUser = req.params.id;
    const user = await User.findById(req.user._id);
    const userToModify = await User.findById(otherUser);

    if (user._id === otherUser) {
      throw new Error("You cannot follow yourself!");
    }

    if (!user || !userToModify) {
      throw new Error("User not found!");
    }

    const modifyUserFollowings = user.following.some(id => id.toString() === otherUser);

    if (modifyUserFollowings) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { following: otherUser },
      });
      await User.findByIdAndUpdate(otherUser, {
        $pull: { followers: user._id },
      });

      const updatedUser = await User.findById(req.user._id);
      return res.json({ user: updatedUser, status: 200, message: "User unfollowed!" });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $push: { following: otherUser },
      });
      await User.findByIdAndUpdate(otherUser, {
        $push: { followers: user._id },
      });

      const updatedUser = await User.findById(req.user._id);
      return res.json({ user: updatedUser, status: 200, message: "User followed!" });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const searchUsers = async (req, res) => {
  const { query } = req.params;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("-password -updatedAt");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  userSignUp,
  userSignIn,
  userSignOut,
  userUpdate,
  userProfile,
  userFollowUnfollow,
  searchUsers,
  getMe,
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
