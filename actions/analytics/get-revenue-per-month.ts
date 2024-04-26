"use server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { endOfYear, startOfYear } from "date-fns";
import getCurrentUser from "../get-current-user";
import { DateRange } from "@/lib/models/DaateRange";

export interface RevenuePerMonthResponse {
  date: "string";
  revenue: number;
}

export async function getRevenuePerMonth(date: DateRange) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const revenueByMonth: RevenuePerMonthResponse[] = await db.$queryRaw`
        SELECT
            TO_CHAR("createdAt", 'Mon yyyy') AS date,
            SUM(amount) AS revenue
        FROM
            "Payments"
        WHERE
            "schoolId" = ${currentUser!.schoolId} AND "createdAt" >= ${
      date.from
    } AND "createdAt" <= ${date.to}
        GROUP BY
            date
        ORDER BY
            date;
      `;

    return revenueByMonth;
  } catch (error) {
    console.error("Error fetching payments by month:", error);
    return { error: "Error fetching payments by month" };
  }
}
