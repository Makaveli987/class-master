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

export const getCourseStats = async (courseId: string) => {
  try {
    const course = await getCourse(courseId);

    const totalEnrollments = await db.enrollment.count({
      where: { courseId },
    });

    const activeEnrollments = await db.enrollment.count({
      where: {
        attendedClasses: {
          lt: course?.totalClasses,
        },
      },
    });

    const totalTeachers = await db.userPerCourse.count({
      where: { courseId },
    });

    return { totalEnrollments, activeEnrollments, totalTeachers };
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching Enrollements");
    return null;
  }
};
