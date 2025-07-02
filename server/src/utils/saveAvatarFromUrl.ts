import https from "https";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

/**
 * Downloads an image from a given URL and saves it to the server's filesystem.
 * @param photoURL - The URL of the image to download.
 * @param userId - The ID of the user, used to create a unique filename.
 * @param extension - File extension/type, defaults to 'jpg'.
 * @returns Promise resolving to the relative path of the saved image.
 */
export const saveAvatarFromUrl = (photoURL: string, userId: mongoose.Types.ObjectId, extension: string = "jpg"): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = `avatar_${userId.toString()}_${Date.now()}.${extension}`;
    const folderPath = path.join(process.cwd(), "uploads", "users", "avatars");
    const fullPath = path.join(folderPath, filename);

    fs.mkdirSync(folderPath, { recursive: true });

    const file = fs.createWriteStream(fullPath);

    try {
      new URL(photoURL);
    } catch {
      return reject(new Error("Invalid URL"));
    }

    https
      .get(photoURL, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to get image, status code: ${response.statusCode}`));
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(`/uploads/users/avatars/${filename}`);
        });

        file.on("error", (err: any) => {
          fs.unlink(fullPath, () => {});
          reject(err);
        });
      })
      .on("error", (err) => {
        fs.unlink(fullPath, () => {});
        reject(err);
      });
  });
};
