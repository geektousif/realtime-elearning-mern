import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route";
import roleRouter from "./routes/role.route";
import profileRouter from "./routes/userProfile.route";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/profile", profileRouter);

export { app };
