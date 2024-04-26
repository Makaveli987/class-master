"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export async function getCompletedEnrollments() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const inProgressEnrollments = await db.enrollment.count({
      where: { schoolId: currentUser.schoolId, completed: false },
    });

    const completedEnrollments = await db.enrollment.count({
      where: { schoolId: currentUser.schoolId, completed: true },
    });

    return [
      { name: "Completed", value: completedEnrollments },
      { name: "In Progress", value: inProgressEnrollments },
    ];
  } catch (error) {
    console.error("Error retrieving completed/inProgress enrollments:", error);
    throw error;
  }
}
