"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export interface RevenueByCourseResponse {
  name: string;
  value: number | string;
}

export async function getTotalRevenueByCourse() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const revenuePerCourse: RevenueByCourseResponse[] = await db.$queryRaw`
        SELECT
            c.name AS name,
            SUM(p.amount) AS value
        FROM
            "Payments" p
        JOIN
            "Enrollment" e ON p."enrollmentId" = e.id
        JOIN
            "Course" c ON e."courseId" = c.id
        WHERE
            p."schoolId" = ${currentUser!.schoolId} AND
            EXTRACT(YEAR FROM p."createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY
            c.name;
        `;
    return revenuePerCourse;
  } catch (error) {
    console.error("Error retrieving revenue per course:", error);
    throw error;
  }
}
