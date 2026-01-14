import express from "express";
import {
  userSignUp,
  userSignIn,
  userSignOut,
  userProfile,
  userUpdate,
  userFollowUnfollow,
  searchUsers,
  getMe,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);

router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.post("/signout", protectRoute, userSignOut);
router.get("/profile/:username", userProfile);
router.get("/search/:query", protectRoute, searchUsers);
router.put("/update/:id", protectRoute, userUpdate);
router.put("/followUnfollow/:id", protectRoute, userFollowUnfollow);

export default router;
