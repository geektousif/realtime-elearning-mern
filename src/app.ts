import express from "express";
import userRouter from "./routes/user.route";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

export { app };
