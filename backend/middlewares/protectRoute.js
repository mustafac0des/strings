import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new Error("Unauthorized!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new Error("User not found");
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
    console.log("Error in protectRoute middleware: ", err.message);
  }
};

export default protectRoute;
