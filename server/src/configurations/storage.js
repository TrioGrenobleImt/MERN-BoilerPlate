import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({
  destination: (_, file, callback) => {
    callback(null, "uploads/users/avatars");
  },
  filename: (req, file, callback) => {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    const id = req.userId;

    const fileName = `${id}_avatar.${extension}`;
    callback(null, fileName);
  },
});

// File type filter
const fileFilter = (_, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
    return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only image files are allowed"), false);
  }
  callback(null, true);
};

// Multer instance
export const configurationStorage = () =>
  multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  });
