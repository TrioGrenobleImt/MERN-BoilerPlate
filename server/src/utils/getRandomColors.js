export const getRandomColor = () => {
  const colors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#9b59b6",
    "#1abc9c",
    "#f1c40f",
    "#e67e22",
    "#34495e",
    "#95a5a6",
    "#d35400",
    "#c0392b",
    "#7f8c8d",
    "#8e44ad",
    "#27ae60",
    "#2980b9",
    "#16a085",
    "#f39c12",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
