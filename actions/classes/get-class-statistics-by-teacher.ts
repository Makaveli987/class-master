"use server";
import { db } from "@/lib/db";
import { DateRange } from "@/lib/models/DaateRange";
import { Role } from "@prisma/client";
import getCurrentUser from "../get-current-user";

export interface TotalClassesByTeacher {
  date: string;
  teacherId: string;
  classes: number;
}

export interface TotalClassesByTeacherResponse {
  data: TotalClassesByTeacher[];
  error?: string;
}

export async function getTotalClassesByTeacherPerMonth(
  teacherId: string,
  date: DateRange
) {
  try {
    const currentUser = await getCurrentUser();

    const dateFrom = new Date("2024-01-01"); // Replace with actual start date
    const dateTo = new Date(); // Replace with actual end date

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { data: [], error: "Unauthorized" };
    }

    const classesPerMonth: TotalClassesByTeacher[] = await db.$queryRaw`
        SELECT
            TO_CHAR("start", 'Mon yyyy') AS date,
            "teacherId",
            COUNT("id") AS classes
        FROM
            "SchoolClass"
        WHERE
            "schoolId" = ${currentUser!.schoolId} AND "start" >= ${
      date.from
    } AND "start" <= ${
      date.to
    } AND "teacherId" = ${teacherId} AND "schoolClassStatus" = 'HELD'
        GROUP BY
            date, "teacherId"
        ORDER BY
            date;
      `;

    classesPerMonth.forEach((entry) => (entry.classes = Number(entry.classes)));

    return { data: classesPerMonth };
  } catch (error) {
    console.error("Error fetching enrollments by month:", error);
    return { data: [], error: "Error fetching enrollments by month" };
  }
}
