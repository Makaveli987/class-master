"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../get-current-user";

export async function assignCourses(coursesIds: string[], teacherId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized.");
  }

  if (!teacherId) {
    throw new Error("Missing teacherId.");
  }

  const assignedCourses = await db.userPerCourse.findMany({
    where: {
      userId: teacherId,
    },
    select: {
      courseId: true,
    },
  });

  const assignedCoursesIds = assignedCourses.map((c) => c.courseId);

  try {
    const result = await db.$transaction(async (tx) => {
      // Unassign courses
      await tx.userPerCourse.deleteMany({
        where: {
          userId: teacherId,
          courseId: {
            in: assignedCoursesIds,
          },
        },
      });

      const data = coursesIds.map((id) => ({
        userId: teacherId,
        courseId: id,
      }));
      // Assign courses
      const newAssignedCourses = await tx.userPerCourse.createMany({
        data,
      });

      return newAssignedCourses;
    });

    revalidatePath(`/school/teachers/${teacherId}`);

    return { data: result, message: "Courses sucesfully assigned" };
  } catch (error) {
    return { error: "Something bad happened. Courses were not assigned" };
  }
}
