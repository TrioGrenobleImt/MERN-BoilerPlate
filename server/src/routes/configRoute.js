import express from "express";
import { getConfig, createConfig, updateConfig, deleteConfig } from "../controllers/configController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const configRouter = new express.Router();

configRouter.get("/", verifyToken({ role: "admin" }), getConfig);

configRouter.post("/", verifyToken({ role: "admin" }), createConfig);
configRouter.put("/", verifyToken({ role: "admin" }), updateConfig);
configRouter.delete("/", verifyToken({ role: "admin" }), deleteConfig);
