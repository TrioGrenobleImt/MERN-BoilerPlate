import express from "express";
import { getConnectedUser, login, logout, register } from "../controllers/authenticationController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//Login to the app
router.post("/login", login);

//Register
router.post("/register", register);

//Logout
router.get("/logout", logout);

//Send the connected user infos
router.get("/me", verifyToken(), getConnectedUser);

export default router;
