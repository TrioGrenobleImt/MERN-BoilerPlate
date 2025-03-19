import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { configurationStorage } from "../configurations/storage.js";
import multer from "multer";
import userModel from "../models/userModel.js";

const router = express.Router();

// /**
//  * @route GET /avatar/default
//  * @description Generates a default avatar image with a random color.
//  * @returns {object} Returns an SVG image with a random color.
//  */
// router.get("/avatar/default", (req, res) => {
//   const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
//   const svg = `
//       <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="50" cy="50" r="50" fill="${color}" />
//         <circle cx="50" cy="40" r="15" fill="white" />
//         <rect x="30" y="60" width="40" height="25" rx="10" fill="white" />
//       </svg>
//     `;
//   res.setHeader("Content-Type", "image/svg+xml");
//   res.send(svg);
// });

router.get("/avatar/default", async (req, res) => {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  const svg = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="${color}" />
                <circle cx="50" cy="40" r="15" fill="white" />
                <rect x="30" y="60" width="40" height="25" rx="10" fill="white" />
                </svg>;
            `;
  res.set("Content-Type", "imag e/svg+xml");
  res.send(svg);
});

/**
 * @route POST /upload/avatar
 * @description Uploads a profile picture for the user.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
router.post("/avatar", verifyToken(), (req, res, next) => {
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
