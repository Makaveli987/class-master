"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export interface OverviewStatsResponse {
  totalRevenue: number;
  totalEnrolledCurses: number;
  totalStudents: number;
  totalGroups: number;
}

export async function getOverviewStats() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const revenue = await db.payments.aggregate({
      _sum: {
        amount: true,
      },
      where: { schoolId: currentUser.schoolId },
    });

    const totalEnrolledCurses = await db.enrollment.count({
      where: { schoolId: currentUser.schoolId },
    });

    const totalStudents = await db.student.count({
      where: { schoolId: currentUser.schoolId, archived: false },
    });

    const totalGroups = await db.group.count({
      where: { schoolId: currentUser.schoolId, archived: false },
    });

    return {
      totalRevenue: revenue._sum.amount,
      totalEnrolledCurses,
      totalStudents,
      totalGroups,
    };
  } catch (error) {
    console.error("Error retrieving total payments amount:", error);
    throw error;
  }
}
