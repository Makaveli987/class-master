export const DialogAction = {
  CREATE: "CREATE",
  EDIT: "EDIT",
} as const;

// eslint-disable-next-line no-redeclare
export type DialogAction = (typeof DialogAction)[keyof typeof DialogAction];
