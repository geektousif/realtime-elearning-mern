import { connect } from "mongoose";
import { DB_NAME } from "../constants/constants";
import { MONGO_URI } from ".";

const connectDB = async () => {
  try {
    const connection = await connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`MongoDB Connected with  ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
