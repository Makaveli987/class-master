import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { Group, Student, StudentToGroup } from "@prisma/client";

interface Students extends StudentToGroup {
  student: Pick<Student, "id" | "firstName" | "lastName">;
}

export interface GroupResponse extends Group {
  students: Students[];
}

export const getGroups = async () => {
  try {
    const currentUser = await getCurrentUser();

    const groups = await db.group.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        active: "desc",
      },
    });

    return groups as GroupResponse[];
  } catch (error) {
    console.error("[GROUPS] Error fetching groups ", error);
    return null;
  }
};

export const getGroup = async (groupId: string) => {
  try {
    const group = await db.group.findFirst({
      where: { id: groupId, archived: false },
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    return group as GroupResponse;
  } catch (error) {
    console.error("[GROUPS] Error fetching groups ", error);
    return null;
  }
};
