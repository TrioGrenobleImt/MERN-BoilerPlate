import express from "express";
import { sendEmail } from "../controllers/serviceController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const serviceRouter = new express.Router();

serviceRouter.post("/send-email", verifyToken(), sendEmail);
