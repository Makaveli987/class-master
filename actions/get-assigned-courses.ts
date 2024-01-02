import { db } from "@/lib/db";
import { AssignedCourse } from "@/lib/models/AssignedCourse";

export const getAssignedCourses = async (teacherId: string) => {
  try {
    const courses = await db.userPerCourse.findMany({
      where: { userId: teacherId },
      select: {
        id: true,
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return courses as unknown as AssignedCourse[];
  } catch (error) {
    console.error("[COURSES] Error fetching courses");
    return null;
  }
};
