import { db } from "@/lib/db";
import { getCourse } from "./get-courses";

export const getCourseStats = async (courseId: string) => {
  try {
    const course = await getCourse(courseId);

    const totalEnrollments = await db.enrollment.count({
      where: { courseId, archived: false },
    });

    const activeEnrollments = await db.enrollment.count({
      where: {
        courseId,
        attendedClasses: {
          lt: course?.defaultTotalClasses,
        },
        archived: false,
      },
    });

    return { totalEnrollments, activeEnrollments };
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching Enrollements");
    return null;
  }
};
