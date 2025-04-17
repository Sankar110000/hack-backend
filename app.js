import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.urlencoded({extended: true}));

app.use("/api/user", userRouter);

export {app};