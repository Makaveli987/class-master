export const ClassType = {
  STUDENT: "STUDENT",
  GROUP: "GROUP",
} as const;

// eslint-disable-next-line no-redeclare
export type ClassType = (typeof ClassType)[keyof typeof ClassType];
