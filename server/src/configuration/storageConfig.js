import multer from "multer";

export const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/avatars");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, `avatar_${req.userId}_${Date.now()}${extension ? `.${extension}` : ""}`);
  },
});
