import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

export const getStudentsEnrollments = async () => {
  try {
    const currentUser = await getCurrentUser();
    const enrollments = await db.enrollment.findMany({
      where: { schoolId: currentUser?.schoolId, groupId: null },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments;
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching ADMIN role");
    return null;
  }
};

export const getGroupsEnrollments = async () => {
  try {
    const currentUser = await getCurrentUser();
    const enrollments = await db.enrollment.findMany({
      where: { schoolId: currentUser?.schoolId, studentId: null },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments;
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching ADMIN role");
    return null;
  }
};

export const getEnrollmentsByStudentId = async (studentId: string) => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments;
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching ADMIN role");
    return null;
  }
};

export const getEnrollmentsByGroupId = async (groupId: string) => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { groupId },
      include: {
        teacher: true,
        course: true,
      },
    });
    return enrollments;
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching ADMIN role");
    return null;
  }
};
