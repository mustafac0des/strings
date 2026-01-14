import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      console.log("Error in protectRoute middleware: No token provided");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("Error in protectRoute middleware: User not found");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;

    next();
  } catch (err) {
    console.log("Error in protectRoute middleware: ", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default protectRoute;
