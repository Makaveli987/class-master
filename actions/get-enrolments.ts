import { db } from "@/lib/db";

export const getStudentEnrollments = async (studentId: string) => {
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

export const getGroupEnrollments = async (groupId: string) => {
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
