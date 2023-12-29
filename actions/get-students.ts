import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

export const getStudents = async () => {
  try {
    const currentUser = await getCurrentUser();

    const students = await db.student.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
    });
    return students;
  } catch (error) {
    console.error("[STUDENTS] Error fetching students ", error);
    return null;
  }
};

export const getStudent = async (studentId: string) => {
  try {
    const student = await db.student.findUnique({
      where: { id: studentId, archived: false },
    });

    return student;
  } catch (error) {
    console.error("[STUDENTS] Error fetching students ", error);
    return null;
  }
};
