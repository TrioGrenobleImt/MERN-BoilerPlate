import multer from "multer";

// Configuration du stockage des fichiers téléchargés
const storageConfig = multer.diskStorage({
  // Destination des fichiers téléchargés
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/avatars");
  },

  // Nom du fichier basé sur l'ID utilisateur et un timestamp
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, `avatar_${req.userId}_${Date.now()}.${extension}`);
  },
});

// Middleware Multer pour gérer les fichiers
export const uploadConfig = multer({
  storage: storageConfig,
});
