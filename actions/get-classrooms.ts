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

export const getClassroomsOptions = async () => {
  try {
    const currentUser = await getCurrentUser();
    const classrooms = await db.classroom.findMany({
      where: { schoolId: currentUser?.schoolId, archived: false },
      select: { id: true, name: true },
    });

    const classroomOptions = classrooms.map((classroom) => ({
      value: classroom.id,
      label: classroom.name,
    }));
    classroomOptions.unshift({ value: "all", label: "All" });

    return classroomOptions;
  } catch (error) {
    console.error("[CLASSROOMS] Error fetching classrooms options");
    return null;
  }
};
