import jwt from "jsonwebtoken";
import { Constants } from "../../constants/constants.js";

/**
 * @description Generates a JWT (JSON Web Token) for the user, containing their user ID.
 * @param {string} userId - The ID of the user for whom the token is being generated.
 * @returns {string} The generated JWT token.
 */
export const generateAccessToken = (userId) => {
  if (!process.env.SECRET_ACCESS_TOKEN) {
    console.error("Please specify the access token secret in the .env file.");
    process.exit(1);
  } else {
    return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: Constants.MAX_AGE });
  }
};
