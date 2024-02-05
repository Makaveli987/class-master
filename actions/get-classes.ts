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

export interface SchoolClassResponse extends SchoolClass {
  student: Pick<Student, "id" | "firstName" | "lastName">;
  group: Pick<Group, "id" | "name">;
  course: Pick<Course, "id" | "name">;
  originalTeacher: Pick<User, "id" | "firstName" | "lastName">;
  substituteTeacher: Pick<User, "id" | "firstName" | "lastName">;
  classroom: Pick<Classroom, "id" | "name">;
}

export const getClasses = async () => {
  try {
    const currentUser = await getCurrentUser();
    const classes = await db.schoolClass.findMany({
      where: {
        schoolId: currentUser?.schoolId,
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
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        // originalTeacher: {
        //   select: {
        //     id: true,
        //     firstName: true,
        //     lastName: true,
        //   },
        // },
        // substituteTeacher: {
        //   select: {
        //     id: true,
        //     firstName: true,
        //     lastName: true,
        //   },
        // },
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
