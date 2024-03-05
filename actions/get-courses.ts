import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { Course, User, UserPerCourse } from "@prisma/client";

interface Teacher extends UserPerCourse {
  user: Pick<User, "id" | "firstName" | "lastName" | "active">;
}

export interface CourseResponse extends Course {
  userPerCourses: Teacher[];
}

export const getCourses = async () => {
  try {
    const currentUser = await getCurrentUser();

    const courses = await db.course.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
      include: {
        userPerCourses: {
          include: {
            user: {
              where: {
                archived: false,
              },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                active: true,
              },
            },
          },
        },
      },
      orderBy: { active: "desc" },
    });
    return courses as unknown as CourseResponse[];
  } catch (error) {
    console.error("[COURSES] Error fetching courses");
    return null;
  }
};

export const getCourse = async (courseId: string) => {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    return course;
  } catch (error) {
    console.error("[COURSES] Error fetching students ", error);
    return null;
  }
};
