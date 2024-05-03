"use server";

import { ComboboxOptions } from "@/components/ui/combobox";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";

export type StudentsOptionsResponse = {
  data: ComboboxOptions[];
  info?: string;
  error?: string;
};

export async function getStudentsOptionsByTeacherId(
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
        studentId: { not: null },
        groupId: null,
        archived: false,
      },
      include: {
        student: {
          where: { archived: false },
          select: { id: true, fullName: true },
        },
      },
    });

    const mappedStudents: ComboboxOptions[] = [];

    enrollments.forEach((enrollment) => {
      if (enrollment.student) {
        mappedStudents.push({
          value: enrollment.student?.id,
          label: enrollment.student.fullName,
        });
      }
    });

    return { data: mappedStudents };
  } catch (error) {
    return { data: [], error: "Something went wrong" };
  }
}
