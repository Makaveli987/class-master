import { db } from "@/lib/db";

export const getCourseTeachers = async (courseId: string) => {
  try {
    const data = await db.userPerCourse.findMany({
      where: { courseId },
      include: {
        user: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching course teachers");
    return null;
  }
};
