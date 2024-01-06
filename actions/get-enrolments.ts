import { db } from "@/lib/db";
import { getCourse } from "./get-courses";

export const getEnrollments = async (studentId: string) => {
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
