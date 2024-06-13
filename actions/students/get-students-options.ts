"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { ComboboxOptions } from "@/components/ui/combobox";

export type StudentsOptionsResponse = {
  data: ComboboxOptions[];
  info?: string;
  error?: string;
};

export async function getStudentsOptions(
  groupId: string
): Promise<StudentsOptionsResponse> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized.");
  }

  if (!groupId) {
    throw new Error("Missing userId.");
  }

  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: {
        students: {
          select: {
            student: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    const students = group?.students.map((s) => ({
      value: s.student.id,
      label: s.student.fullName,
    }));

    return {
      data: students as ComboboxOptions[],
    };
  } catch (error) {
    console.error("[getStudentsOptions]: Error", error);
    return {
      error: "Something bad happened. Courses were not assigned",
      data: [],
    };
  }
}
