import multer from "multer";
import { Constants } from "../../constants/constants.js";

// Configuration de stockage
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/avatars");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, `avatar_${req.userId}_${Date.now()}.${extension}`);
  },
});

// Filtre de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|gif|svg/;
  const isValid = allowedTypes.test(file.mimetype);
  if (!isValid) {
    const error = new Error("Invalid file type. Only jpg, jpeg, png, gif, and svg are allowed.");
    error.statusCode = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const uploadConfig = multer({
  storage: storageConfig,
  fileFilter: fileFilter,
  limits: { fileSize: Constants.AVATAR_MAX_SIZE },
});

export default uploadConfig;
