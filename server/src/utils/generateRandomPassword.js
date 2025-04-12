import { Constants } from "../../constants/constants.js";

/**
 * @function generateRandomPassword
 * @description Generates a random password that matches the defined security pattern.
 * @returns {string} The randomly generated password.
 */
export const generateRandomPassword = () => {
  // Allowed characters for the password
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";

  // Function to get a random character from the allowed set
  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  // Keep generating a password until it matches the security regex pattern
  do {
    password = Array.from({ length: 10 }, getRandomChar).join("");
  } while (!Constants.REGEX_PASSWORD.test(password));

  return password;
};
