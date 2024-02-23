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
      include: {
        group: {
          select: {
            group: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return student;
  } catch (error) {
    console.error("[STUDENTS] Error fetching students ", error);
    return null;
  }
};

export interface StudentGroupsResponse {
  group: { name: string; id: string };
}

export const getStudentGroups = async (studentId: string) => {
  try {
    const groups = await db.student.findUnique({
      where: { id: studentId, archived: false },
      select: {
        group: {
          select: {
            group: {
              select: {
                name: true,
                id: true,
                archived: true,
              },
            },
          },
        },
      },
    });

    const filteredGroups = groups?.group.filter((g) => !g.group.archived);
    console.log("filteredGroups", filteredGroups);

    return filteredGroups as StudentGroupsResponse[];
  } catch (error) {
    console.error("[STUDENTS] Error fetching student groups ", error);
    return null;
  }
};
