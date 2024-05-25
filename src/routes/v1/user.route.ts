import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  registerUser,
  verifyEmail,
} from "../../controllers/user.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshToken);
router.route("/verify/:verifyToken").get(verifyEmail);

// Protected Routes
router.route("/logout").post(auth, logout);

export default router;
