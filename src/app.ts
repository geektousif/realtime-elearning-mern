import express from "express";
import cookieParser from "cookie-parser";

import apiRouter from "./routes";
import errorHandler from "./middlewares/errorHandler.middleware";
import morganMiddleware from "./middlewares/morgan.middleware";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganMiddleware);

app.use("/api", apiRouter);

app.use(errorHandler);

export { app };
