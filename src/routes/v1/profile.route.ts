import { Router } from "express";
import { getUserProfile } from "../../controllers/profile.controller";
import auth from "../../middlewares/auth.middleware";
import { AuthRoles } from "../../constants/enums";

const router = Router();

router.route("/").get(auth([AuthRoles.STUDENT]), getUserProfile);

export default router;
