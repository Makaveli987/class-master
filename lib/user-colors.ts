import { db } from "./db";

export const userColors: string[] = [
  "#475569",
  "#3f3f46",
  "#dc2626",
  //   "#b91c1c",
  "#ea580c",
  //   "#c2410c",
  "#d97706",
  //   "#b45309",
  "#65a30d",
  //   "#4d7c0f",
  "#16a34a",
  //   "#15803d",
  "#059669",
  //   "#047857",
  "#0d9488",
  //   "#0f766e",
  "#0891b2",
  //   "#0e7490",
  "#0284c7",
  //   "#0369a1",
  "#2563eb",
  //   "#1d4ed8",
  "#4f46e5",
  //   "#4338ca",
  "#7c3aed",
  //   "#4338ca",
  "#7c3aed",
  //   "#7e22ce",
  "#c026d3",
  //   "#a21caf",
  "#db2777",
  //   "#be185d",
  "#e11d48",
  //   "#be123c",
];

const getAssignedColors = async () => {
  const assignedColors = await db.assignedColors.findMany();
  return assignedColors.map((record) => record.color);
};

export const getRandomColor = async () => {
  const assignedColors = await getAssignedColors();
  let availableColors = userColors.filter(
    (color) => !assignedColors.includes(color)
  );

  if (availableColors.length === 0) {
    availableColors = userColors;
  }

  const randomColor =
    availableColors[Math.floor(Math.random() * availableColors.length)];

  return randomColor;
};
