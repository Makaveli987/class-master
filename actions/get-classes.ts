import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import {
  Classroom,
  Course,
  Group,
  SchoolClass,
  Student,
  User,
} from "@prisma/client";
import { endOfWeek, startOfWeek } from "date-fns";

export interface SchoolClassResponse extends SchoolClass {
  student: Pick<Student, "id" | "firstName" | "lastName">;
  group: Pick<Group, "id" | "name">;
  enrollment: { id: string; course: Pick<Course, "id" | "name"> };
  teacher: Pick<User, "id" | "firstName" | "lastName">;
  substitutedTeacher: Pick<User, "id" | "firstName" | "lastName">;
  classroom: Pick<Classroom, "id" | "name">;
}

export const getClasses = async () => {
  try {
    const currentUser = await getCurrentUser();

    // Get the start and end dates of the current week
    const currentDate = new Date();
    const startOfWeekDate = startOfWeek(currentDate);
    const endOfWeekDate = endOfWeek(currentDate);

    const classes = await db.schoolClass.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        start: {
          gte: startOfWeekDate,
          lte: endOfWeekDate,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        substitutedTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return classes as SchoolClassResponse[];
    // const att = await db.attendance.deleteMany({
    //   where: {
    //     schoolId: currentUser?.schoolId,
    //   },
    // });
    // const classes = await db.schoolClass.deleteMany({
    //   where: {
    //     schoolId: currentUser?.schoolId,
    //   },
    // });
  } catch (error) {
    console.error("[CLASSES] Error fetching classes ", error);
    return null;
  }
};

export const getClassesByStudentId = async (studentId: string) => {
  try {
    const currentUser = await getCurrentUser();

    // Get the start and end dates of the current week

    const classes = await db.schoolClass.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        studentId,
      },
      orderBy: {
        start: "desc",
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        substitutedTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return classes as SchoolClassResponse[];
  } catch (error) {
    console.error("[CLASSES] Error fetching classes ", error);
    return null;
  }
};

export const getClassesByEnrollmentId = async (enrollmentId: string) => {
  try {
    const currentUser = await getCurrentUser();

    // Get the start and end dates of the current week

    const classes = await db.schoolClass.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        enrollmentId,
      },
      orderBy: {
        start: "desc",
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        substitutedTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return classes as SchoolClassResponse[];
  } catch (error) {
    console.error("[CLASSES] Error fetching classes ", error);
    return null;
  }
};
