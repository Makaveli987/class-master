"use server";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { lastDayOfMonth } from "date-fns";

export interface MonthlyClassStatistics {
  totalClasses: number;
  individualClasses: number;
  groupClasses: number;
  perCourse: any;
}

export interface MonthlyClassStatisticsResponse {
  data: MonthlyClassStatistics;
  error?: string;
}

export async function getClassCountsByTeacherForMonth(
  teacherId: string,
  year: number,
  month: number
): Promise<MonthlyClassStatisticsResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { data: {} as MonthlyClassStatistics, error: "Unauthorized" };
    }
    // Calculate the start and end of the month

    const startDate = new Date(year, month, 1);
    const endDate = lastDayOfMonth(startDate);

    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

    // Raw SQL query
    const result: any = await db.$queryRaw`
    SELECT
      COUNT(*) as "totalClasses",
      SUM(CASE WHEN sc."groupId" IS NULL THEN 1 ELSE 0 END) as "individualClasses",
      SUM(CASE WHEN sc."groupId" IS NOT NULL THEN 1 ELSE 0 END) as "groupClasses",
      c."name" as "courseName",
      COUNT(c."name") as "courseCount"
    FROM
      "SchoolClass" sc
    INNER JOIN
      "Enrollment" e ON sc."enrollmentId" = e."id"
    INNER JOIN
      "Course" c ON e."courseId" = c."id"
    WHERE
      sc."schoolId" = ${currentUser!.schoolId}
      AND sc."teacherId" = ${teacherId}
      AND sc."schoolClassStatus" = 'HELD'
      AND sc."start" >= ${startDateString}::date
      AND sc."start" < (${endDateString}::date + INTERVAL '1 day')
      AND sc."archived" = false
      AND e."archived" = false
    GROUP BY
      c."name"
  `;

    // Format the result
    const formattedResult: MonthlyClassStatistics = {
      totalClasses: 0,
      individualClasses: 0,
      groupClasses: 0,
      perCourse: {},
    };

    result.forEach((row: any) => {
      formattedResult.totalClasses += parseInt(row.totalClasses);
      formattedResult.individualClasses += parseInt(row.individualClasses);
      formattedResult.groupClasses += parseInt(row.groupClasses);
      formattedResult.perCourse[row.courseName] = parseInt(row.courseCount);
    });

    return {
      data: formattedResult,
      error: "",
    };
  } catch (error) {
    console.error("[getClassCountsByTeacherForMonth] Error: ", error);
    return {
      data: {} as MonthlyClassStatistics,
      error: "Something went wrong",
    };
  }
}
