import { Constants } from "../../constants/constants.js";

export const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";

  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  do {
    password = Array.from({ length: 10 }, getRandomChar).join("");
  } while (!Constants.REGEX_PASSWORD.test(password));

  return password;
};
