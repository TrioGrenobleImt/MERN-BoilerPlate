import express from "express";

import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes/router.js";

//Cors configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET, POST, PUT, PATCH, DELETE",
  preflightContinue: true,
};

//express app
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use(router);

export default app;
