import express from "express";
import { getConfig } from "../controllers/configController.js";

export const configRouter = new express.Router();

configRouter.get("/", getConfig);
