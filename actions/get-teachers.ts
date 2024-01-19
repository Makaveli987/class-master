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
    const teacher = await db.user.findFirst({
      where: { id: teacherId, archived: false },
    });
    return teacher;
  } catch (error) {
    console.error("[TEACHERS] Error fetching teacher ", error);
    return null;
  }
};

export const getTeachersOptions = async () => {
  try {
    const currentUser = await getCurrentUser();

    const teachers = await db.user.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        archived: false,
      },
    });

    const teacherOptions = teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.firstName} ${teacher.lastName}`,
    }));
    teacherOptions.unshift({ value: "all", label: "All" });

    return teacherOptions;
  } catch (error) {
    console.error("[TEACHERS] Error fetching teachers options ", error);
    return null;
  }
};
