import dotenv from "dotenv";

import { app } from "./app";
import connectDB from "./config/db";
import { PORT } from "./config";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`App Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed ", err);
  });
