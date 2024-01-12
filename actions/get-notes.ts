import { db } from "@/lib/db";

export const getNotes = async (enrollmentId: string) => {
  try {
    const notes = await db.note.findMany({
      where: { enrollmentId },
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
