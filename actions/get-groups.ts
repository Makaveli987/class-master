import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

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
    return groups;
  } catch (error) {
    console.error("[GROUPS] Error fetching groups ", error);
    return null;
  }
};
