import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

//GET all users
router.get("/list", isAdmin, getUsers);

//Get a single user
router.get("/:id", isAdmin, getUser);

//Create a new user
router.post("/new", isAdmin, createUser);

//Update a user
router.put("/:id", isAdmin, updateUser);

//Delete a user
router.delete("/:id", isAdmin, deleteUser);

export default router;
