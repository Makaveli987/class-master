import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

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
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        originalTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        substituteTeacher: {
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
    return classes;
  } catch (error) {
    console.error("[CLASSES] Error fetching classes ", error);
    return null;
  }
};
