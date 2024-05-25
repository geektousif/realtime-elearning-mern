import { Router } from "express";
import userRouter from "./user.route";
import roleRouter from "./role.route";
import profileRouter from "./profile.route";
import courseRouter from "./course.route";

const router = Router();

router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/profile", profileRouter);
router.use("/courses", courseRouter);

export default router;
