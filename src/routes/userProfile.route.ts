import { Router } from "express";
import { getUserProfile } from "../controllers/userProfile.controller";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(auth, getUserProfile);

export default router;
