import { db } from "@/lib/db";

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
    console.error("Error fetching ADMIN role");
    return null;
  }
};
