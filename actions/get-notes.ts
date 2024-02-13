import { db } from "@/lib/db";

export const getNotes = async (enrollmentId: string, userId: string) => {
  try {
    const notes = await db.note.findMany({
      where: { enrollmentId, userId },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notes;
  } catch (error) {
    console.error("[GROUPS] Error fetching groups ", error);
    return null;
  }
};
