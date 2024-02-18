import { db } from "./db";

export const userColors: string[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
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
