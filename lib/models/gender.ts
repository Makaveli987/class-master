import { ComboboxOptions } from "@/components/ui/combobox";

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

// eslint-disable-next-line no-redeclare
export type GENDER = (typeof GENDER)[keyof typeof GENDER];

export const genderOptions: ComboboxOptions[] = [
  { value: GENDER.MALE, label: "Male" },
  { value: GENDER.FEMALE, label: "Female" },
];
