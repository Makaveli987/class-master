"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export interface StudentsStatsResponse {
  name: string;
  value: number;
}

export async function getStudentsStats() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const active = await db.student.count({
      where: { schoolId: currentUser.schoolId, active: true },
    });

    const inactive = await db.student.count({
      where: { schoolId: currentUser.schoolId, active: false },
    });

    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
    ];
  } catch (error) {
    console.error("Error retrieving students stats:", error);
    throw error;
  }
}
