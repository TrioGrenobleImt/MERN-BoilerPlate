import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, uploadProfilePicture } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { configurationStorage } from "../configurations/storage.js";
import multer from "multer";

const router = express.Router();

/**
 * @route GET /:id
 * @description Retrieves a single user by their ID.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.get("/:id", verifyToken({ role: "admin" }), getUser);

/**
 * @route GET /
 * @description Retrieves a list of all users.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.get("/", verifyToken({ role: "admin" }), getUsers);

/**
 * @route POST /
 * @description Creates a new user with the provided data.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.post("/", verifyToken({ role: "admin" }), createUser);

/**
 * @route PUT /:id
 * @description Updates an existing user by their ID.
 * @param {string} id - The ID of the user to update.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.put("/:id", verifyToken({ role: "admin" }), updateUser);

/**
 * @route DELETE /:id
 * @description Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
router.delete("/:id", verifyToken({ role: "admin" }), deleteUser);

/**
 * @route POST /upload
 * @description Uploads a profile picture for the user.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
router.post("/upload", verifyToken(), (req, res, next) => {
  const upload = configurationStorage().single("avatar");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      let errorMessage = "An error occurred while uploading the file.";
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          errorMessage = "The file is too large. Maximum size: 5MB.";
          break;
        case "LIMIT_UNEXPECTED_FILE":
          errorMessage = "Only image files (jpg, jpeg, png) are allowed.";
          break;
        case "LIMIT_FILE_COUNT":
          errorMessage = "You can only upload one file.";
          break;
        case "LIMIT_FIELD_KEY":
          errorMessage = "The field name is too long.";
          break;
        case "LIMIT_FIELD_VALUE":
          errorMessage = "The field value is too long.";
          break;
        case "LIMIT_FIELD_COUNT":
          errorMessage = "Too many fields provided.";
          break;
        case "LIMIT_PART_COUNT":
          errorMessage = "Too many parts in the form-data request.";
          break;
        default:
          errorMessage = err.message;
      }

      return res.status(400).json({ error: errorMessage });
    } else if (err) {
      return res.status(500).json({ error: "An internal error occurred" });
    }

    uploadProfilePicture(req, res, next);
  });
});
export default router;
