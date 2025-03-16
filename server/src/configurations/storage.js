import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: (_, file, callback) => {
    callback(null, "uploads/users/avatars");
  },
  filename: (_, file, callback) => {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    callback(null, `${uuid()}.${extension}`);
  },
});

const fileFilter = (_, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return callback(new UnauthorizedError("Only image files are allowed"), false);
  callback(null, true);
};

export const configurationStorage = () => multer({ storage, fileFilter });
