export const RepeatScheduleType = {
  SAME_TIME: "SAME_TIME",
  SHIFTS: "SHIFTS",
} as const;

// eslint-disable-next-line no-redeclare
export type RepeatScheduleType =
  (typeof RepeatScheduleType)[keyof typeof RepeatScheduleType];
