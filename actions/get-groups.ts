import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";
import { Group } from "@prisma/client";

export interface GroupResponse extends Group {
  students: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
}

export const getGroups = async () => {
  try {
    const currentUser = await getCurrentUser();

    const groups = await db.group.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
      include: {
        students: {
          select: {
            id: true,
          },
        },
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
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
