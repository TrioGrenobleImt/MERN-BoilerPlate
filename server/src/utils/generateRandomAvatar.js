export const generateRandomAvatar = (username) => {
  return `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;
};
