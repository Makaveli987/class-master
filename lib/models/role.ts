import { ComboboxOptions } from "@/components/ui/combobox";

export const RoleType = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
} as const;

// eslint-disable-next-line no-redeclare
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const roleOptions: ComboboxOptions[] = [
  { value: RoleType.ADMIN, label: "Admin" },
  { value: RoleType.TEACHER, label: "Teacher" },
];
