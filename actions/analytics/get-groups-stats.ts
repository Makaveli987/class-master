"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { Role } from "@prisma/client";

export interface GroupsStatsResponse {
  name: string;
  value: number;
}

export async function getGroupsStats() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role === Role.TEACHER) {
      return { error: "Unauthorized" };
    }

    const active = await db.group.count({
      where: { schoolId: currentUser.schoolId, active: true },
    });

    const inactive = await db.group.count({
      where: { schoolId: currentUser.schoolId, active: false },
    });

    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
    ];
  } catch (error) {
    console.error("Error retrieving group stats:", error);
    throw error;
  }
}
