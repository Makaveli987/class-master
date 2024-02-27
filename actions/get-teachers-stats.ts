import { db } from "@/lib/db";
import { getCourse } from "./get-courses";
import { ClassStatus } from "@/lib/models/class-status";

export const getTeachersStats = async (teacherId: string) => {
  try {
    const course = await getCourse(teacherId);

    const totalEnrollments = await db.enrollment.count({
      where: { teacherId, archived: false },
    });

    const activeEnrollments = await db.enrollment.count({
      where: {
        teacherId,
        archived: false,
        attendedClasses: {
          lt: course?.defaultTotalClasses,
        },
      },
    });

    const totalCourses = await db.userPerCourse.count({
      where: { userId: teacherId },
    });

    const orgClasses = await db.schoolClass.count({
      where: {
        teacherId: teacherId,
        schoolClassStatus: ClassStatus.HELD,
      },
    });

    const subClasses = await db.schoolClass.count({
      where: {
        substitutedTeacherId: teacherId,
        schoolClassStatus: ClassStatus.HELD,
      },
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
