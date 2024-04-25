"use server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { endOfYear, startOfYear } from "date-fns";
import getCurrentUser from "../get-current-user";

export interface NewStudentsPerMonthResponse {
  date: "string";
  students: number;
}

export async function getNewStudentsPerMonth() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const newStudentsPerMonth: NewStudentsPerMonthResponse[] =
      await db.$queryRaw`
      SELECT
          TO_CHAR("createdAt", 'Mon yyyy') AS date,
          COUNT("createdAt") AS students
      FROM
          "Student"
      WHERE
          "schoolId" = ${
            currentUser!.schoolId
          } AND "createdAt" >= ${startOfYear(
        new Date()
      )} AND "createdAt" <= ${endOfYear(new Date())}
      GROUP BY
          date
      ORDER BY
          date;
      `;

    newStudentsPerMonth.forEach(
      (entry) => (entry.students = Number(entry.students))
    );

    return newStudentsPerMonth;
  } catch (error) {
    console.error("Error fetching students by month:", error);
    return { error: "Error fetching students by month" };
  }
}
