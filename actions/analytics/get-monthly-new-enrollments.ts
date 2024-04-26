"use server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { endOfYear, startOfYear } from "date-fns";
import getCurrentUser from "../get-current-user";
import { DateRange } from "@/lib/models/DaateRange";

export interface NewEnrollmentsPerMonthResponse {
  date: string;
  enrollments: number;
}

export async function getNewEnrollmentsPerMonth(date: DateRange) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const newEnrollmentsPerMonth: NewEnrollmentsPerMonthResponse[] =
      await db.$queryRaw`
      SELECT
          TO_CHAR("createdAt", 'Mon yyyy') AS date,
          COUNT("createdAt") AS enrollments
      FROM
          "Enrollment"
      WHERE
          "schoolId" = ${currentUser!.schoolId} AND "createdAt" >= ${
        date.from
      } AND "createdAt" <= ${date.to}
      GROUP BY
          date
      ORDER BY
          date;
      `;

    newEnrollmentsPerMonth.forEach(
      (entry) => (entry.enrollments = Number(entry.enrollments))
    );

    return newEnrollmentsPerMonth;
  } catch (error) {
    console.error("Error fetching enrollments by month:", error);
    return { error: "Error fetching enrollments by month" };
  }
}
