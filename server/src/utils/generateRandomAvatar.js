/**
 * @function generateRandomAvatar
 * @description Generates a random avatar URL for the user using the DiceBear API.
 * @param {string} username - The username to generate the avatar seed.
 * @returns {string} The generated URL for the random avatar.
 */
export const generateRandomAvatar = (username) => {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;
};
