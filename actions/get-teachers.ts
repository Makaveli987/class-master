import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

export const getTeachers = async () => {
  try {
    const currentUser = await getCurrentUser();

    const teachers = await db.user.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        archived: false,
      },
      include: {
        role: true,
      },
    });

    return teachers;
  } catch (error) {
    console.error("[TEACHERS] Error fetching teachers ", error);
    return null;
  }
};

export const getTeacher = async (teacherId: string) => {
  try {
    const teacher = await db.student.findUnique({
      where: { id: teacherId, archived: false },
    });

    return teacher;
  } catch (error) {
    console.error("[TEACHERS] Error fetching teacher ", error);
    return null;
  }
};
