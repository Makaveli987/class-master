"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export async function getTotalRevenueByCourse() {
  console.log("object :>> ");
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const paymentsPerCourse = await db.$queryRaw`
        SELECT
            c.name AS name,
            SUM(p.amount) AS revenue
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
    console.log("paymentsPerCourse :>> ", paymentsPerCourse);
    return paymentsPerCourse;
  } catch (error) {
    console.error("Error retrieving payments per course:", error);
    throw error;
  }
}
