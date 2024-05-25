import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import { app } from "./app";
import connectDB from "./config/db.config";
import { PORT } from "./config/env.config";

dotenv.config({
  path: "./env",
});

const server = http.createServer(app);
const io = new Server(server);

connectDB()
  .then(() => {
    server.listen(PORT || 8000, () => {
      console.log(`App Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed ", err);
  });
