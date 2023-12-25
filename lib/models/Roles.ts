export const RoleType = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
} as const;

// eslint-disable-next-line no-redeclare
export type RoleType = (typeof RoleType)[keyof typeof RoleType];
