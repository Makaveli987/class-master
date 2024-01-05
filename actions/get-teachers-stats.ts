import { db } from "@/lib/db";
import { getCourse } from "./get-courses";

export const getTeachersStats = async (teacherId: string) => {
  try {
    const course = await getCourse(teacherId);

    const totalEnrollments = await db.enrollment.count({
      where: { teacherId },
    });

    const activeEnrollments = await db.enrollment.count({
      where: {
        teacherId,
        attendedClasses: {
          lt: course?.totalClasses,
        },
      },
    });

    const totalCourses = await db.userPerCourse.count({
      where: { userId: teacherId },
    });

    const orgClasses = await db.class.count({
      where: { originalTeacherId: teacherId, canceled: false },
    });

    const subClasses = await db.class.count({
      where: { substituteTeacherId: teacherId, canceled: false },
    });

    return {
      totalEnrollments,
      activeEnrollments,
      totalCourses,
      totalClasses: orgClasses + subClasses,
    };
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching Enrollements");
    return null;
  }
};
