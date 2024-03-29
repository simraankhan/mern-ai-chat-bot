import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: process.env.ALLOW_ORIGIN, credentials: true }));

// Router
app.use("/api/v1", appRouter);

export default app;
