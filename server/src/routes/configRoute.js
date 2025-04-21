import express from "express";
import { getConfig, updateConfig } from "../controllers/configController.js";

export const configRouter = new express.Router();

configRouter.get("/", getConfig);
configRouter.put("/", updateConfig);
