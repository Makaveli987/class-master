import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { EnrollDialogCourse } from "@/components/enrolled-courses/enroll-dialog";

export const getCourses = async () => {
  try {
    const currentUser = await getCurrentUser();

    const courses = await db.course.findMany({
      where: { schoolId: currentUser?.schoolId },
      include: {
        userPerCourses: {
          include: {
            user: {
              where: {
                archived: false,
              },
            },
          },
        },
      },
    });
    return courses;
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
