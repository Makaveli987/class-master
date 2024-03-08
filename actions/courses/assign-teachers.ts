"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../get-current-user";

export async function assignTeachers(teachersIds: string[], courseId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: "Unauthorized",
    };
  }

  if (!courseId) {
    return { error: "Missing teacherId" };
  }

  const assignedTeachers = await db.userPerCourse.findMany({
    where: {
      courseId,
    },
    select: {
      userId: true,
    },
  });

  const assignedTeachersIds = assignedTeachers.map((c) => c.userId);

  try {
    const result = await db.$transaction(async (tx) => {
      // Unassign teachers
      await tx.userPerCourse.deleteMany({
        where: {
          courseId,
          userId: {
            in: assignedTeachersIds,
          },
        },
      });

      const data = teachersIds.map((id) => ({ userId: id, courseId }));
      // Assign teachers
      const newAssignedCourses = await tx.userPerCourse.createMany({
        data,
      });

      return newAssignedCourses;
    });

    revalidatePath(`/school/courses/${courseId}`);

    return { data: result, message: "Courses sucesfully assigned" };
  } catch (error) {
    return { error: "Something bad happened. Courses were not assigned" };
  }
}
