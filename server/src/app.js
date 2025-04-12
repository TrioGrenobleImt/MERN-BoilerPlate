import express from "express";

import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";

// Create the Express application instance
export const app = express();

// Global middleware
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Log each incoming request (method and path)
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Enable CORS with predefined options
app.use(cors(corsOptions));

// Parse cookies from incoming requests
app.use(cookieParser());

// Register main application routes
app.use(router);
