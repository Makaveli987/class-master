"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export interface EnrollmentsByCourseResponse {
  name: string;
  value: number | string;
}

export async function getTotalEnrollmentsByCourse() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const enrollmentsPerCourse: EnrollmentsByCourseResponse[] =
      await db.$queryRaw`
    SELECT
        c.name AS "name",
        COUNT(e.id) AS "value"
    FROM
        "Enrollment" e
    JOIN
        "Course" c ON e."courseId" = c.id
    WHERE
        c."schoolId" = ${currentUser!.schoolId}
    GROUP BY
        c.id;
        `;

    enrollmentsPerCourse.forEach(
      (entry) => (entry.value = Number(entry.value))
    );
    return enrollmentsPerCourse;
  } catch (error) {
    console.error("Error retrieving enrollments per course:", error);
    throw error;
  }
}
