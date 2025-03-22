const getDefaultAvatar = async (req, res) => {
  const color = decodeURIComponent(req.query.color);
  const svg = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${color}" />
      <circle cx="50" cy="40" r="15" fill="white" />
      <rect x="30" y="60" width="40" height="25" rx="10" fill="white" />
      </svg>
      `;
  res.set("Content-Type", "image/svg+xml");
  res.send(svg);
};

const updateUserAvatar = async (req, res) => {
  return res.status(200).json({
    message: "User avatar updated successfuly",
  });
};

export { getDefaultAvatar, updateUserAvatar };
