import express from "express";

import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";

//express app
export const app = express();

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
