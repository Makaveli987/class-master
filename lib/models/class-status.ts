export const ClassStatus = {
  SCHEDULED: "SCHEDULED",
  CANCELED: "CANCELED",
  HELD: "HELD",
} as const;

// eslint-disable-next-line no-redeclare
export type ClassStatus = (typeof ClassStatus)[keyof typeof ClassStatus];
