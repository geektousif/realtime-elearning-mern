import { Router } from "express";
import { createRole } from "../controllers/role.controller";

const router = Router();

router.route("/").post(createRole);

export default router;
