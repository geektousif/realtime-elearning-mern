import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/user.controller";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);

// Protected Routes
router.route("/logout").post(auth, logout);
router.route("/refresh-token").post(auth, refreshToken);

export default router;
