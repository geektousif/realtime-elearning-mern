import { Router } from "express";
import { login, registerUser } from "../controllers/user.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);

export default router;