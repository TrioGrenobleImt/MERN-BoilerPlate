import { Constants } from "../constants/constants.js";

/**
 * Generate a random password matching the security regex from Constants.
 * @returns {string} Randomly generated password.
 */
export const generateRandomPassword = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";
  const getRandomChar = (): string => chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  do {
    password = Array.from({ length: 10 }, getRandomChar).join("");
  } while (!Constants.REGEX_PASSWORD.test(password));

  return password;
};
