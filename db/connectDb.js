import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const DBNAME = "hackathon";
const MONGO_URL = process.env.MONGO_URL;

async function connectDb() {
  try {
    console.log(MONGO_URL);
    
    const connectionInstance = await mongoose.connect(`${MONGO_URL}/${DBNAME}`);
    console.log(
      "MongoDB connected successfully:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export { connectDb };
