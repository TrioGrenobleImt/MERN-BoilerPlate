import https from "https";
import fs from "fs";
import path from "path";

/**
 * Downloads an image from a given URL and saves it to the server's filesystem.
 * @param {string} photoURL - The URL of the image to download.
 * @param {string} userId - The ID of the user, used to create a unique filename.
 * @return {Promise<string>} - A promise that resolves to the path of the saved image.
 */
export const saveAvatarFromUrl = (photoURL, userId) => {
  return new Promise((resolve, reject) => {
    const extension = "jpg";
    const filename = `avatar_${userId}_${Date.now()}.${extension}`;
    const folderPath = path.join(process.cwd(), "uploads", "users", "avatars");
    const fullPath = path.join(folderPath, filename);

    fs.mkdirSync(folderPath, { recursive: true });

    const file = fs.createWriteStream(fullPath);

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
      })
      .on("error", (err) => {
        fs.unlink(fullPath, () => {});
        reject(err);
      });
  });
};
