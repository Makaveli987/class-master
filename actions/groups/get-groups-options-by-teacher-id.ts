"use server";

import { ComboboxOptions } from "@/components/ui/combobox";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";

export type StudentsOptionsResponse = {
  data: ComboboxOptions[];
  info?: string;
  error?: string;
};

export async function getGroupsOptionsByTeacherId(
  teacherId: string
): Promise<StudentsOptionsResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { data: [], error: "Unauthorized" };
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        teacherId,
        studentId: null,
        groupId: { not: null },
        archived: false,
      },
      include: {
        group: {
          where: { archived: false },
          select: { id: true, name: true },
        },
      },
    });

    const mappedGroups: ComboboxOptions[] = [];

    enrollments.forEach((enrollment) => {
      if (enrollment.group) {
        mappedGroups.push({
          value: enrollment.group?.id,
          label: enrollment.group.name,
        });
      }
    });

    return { data: mappedGroups };
  } catch (error) {
    return { data: [], error: "Something went wrong" };
  }
}
