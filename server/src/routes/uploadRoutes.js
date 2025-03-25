import express from "express";
import { getDefaultAvatar, updateUserAvatar } from "../controllers/uploadController.js";
import verifyToken from "../middlewares/verifyToken.js";
import uploadConfig from "../configuration/storageConfig.js";
import multer from "multer";

const router = express.Router();

router.get("/avatar/default", getDefaultAvatar);

router.post("/avatar/:id", verifyToken(), uploadConfig.single("avatar"), updateUserAvatar);

// Middleware global pour gérer les erreurs de multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreurs liées à multer (par exemple, dépassement de taille de fichier)
    return res.status(400).json({ error: err.message });
  }

  if (err.statusCode === 400) {
    // Erreur personnalisée levée dans le fileFilter de multer
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "An unexpected error occurred." });
});

export default router;
