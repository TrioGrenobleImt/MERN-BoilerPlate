import express from "express";

import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import UsersRoutes from "./routes/usersRoutes.js";
import AuthenticationRoutes from "./routes/authenticationRoutes.js";
import LogsRoutes from "./routes/logsRoutes.js";

//Cors configuration
const corsOptions = {
  origin: "http://localhost:5173",
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

//routes
app.use("/api/users", UsersRoutes);
app.use("/api/auth", AuthenticationRoutes);
app.use("/api/logs", LogsRoutes);
app.use("/api/uploads", express.static("uploads"));
/**
 * Healthcheck
 * @route GET /api/ping
 * @desc Check if the server is running
 * @access Public
 * @returns {object} Returns a JSON object with a message property indicating the server is running
 */
app.get("/api/ping", (req, res) => {
  return res.status(200).json({ message: "The server is running!" });
});

/**
 * Handle errors
 * @route ALL *
 * @desc Handle all other routes and return a 404 error
 * @access Public
 * @returns {object} Returns a JSON object with an error property indicating the route was not found
 */
app.use("/", (req, res) => {
  return res.status(404).json({ error: `The requested route ${req.originalUrl} was not found` });
});

export default app;
