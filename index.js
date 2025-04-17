import { app } from "./app.js";
import { connectDb } from "./db/connectDb.js";
import dotenv from "dotenv";

dotenv.config({
    path: ".env"
});

connectDb().then(() => {
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error("Error connecting to the database", err);
    process.exit(1);
});