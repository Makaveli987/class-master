import { db } from "@/lib/db";
import getCurrentUser from "./get-current-user";

export const getClassrooms = async () => {
  try {
    const currentUser = await getCurrentUser();
    const classrooms = await db.classroom.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
    });
    return classrooms;
  } catch (error) {
    console.error("[CLASSROOMS] Error fetching classrooms");
    return null;
  }
};
