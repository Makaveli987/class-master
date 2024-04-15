import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { db } from "@/lib/db";
import { Enrollment, Group, Note, Student, User } from "@prisma/client";

export interface NoteResponse extends Note {
  teacher: Pick<User, "id" | "firstName" | "lastName">;
  student?: Pick<Student, "id" | "firstName" | "lastName">;
  group?: Pick<Group, "id" | "name">;
  enrollment?: {
    course: {
      name: string;
    };
  };
}

export const getNotes = async (
  enrollmentId: string,
  userId: string,
  userType: EnrollUserType
) => {
  try {
    let query;

    if (userType === EnrollUserType.GROUP) {
      query = { enrollmentId, groupId: userId };
    } else {
      query = { enrollmentId, studentId: userId };
    }

    const notes: NoteResponse[] = await db.note.findMany({
      where: query,
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

export const getAllUserNotes = async (
  userId: string,
  userType: EnrollUserType
) => {
  try {
    let query;

    if (userType === EnrollUserType.GROUP) {
      query = { groupId: userId };
    } else {
      query = { studentId: userId };
    }

    const notes = await db.note.findMany({
      where: query,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            name: true,
          },
        },
        enrollment: {
          select: {
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notes as NoteResponse[];
  } catch (error) {
    console.error("[GROUPS] Error fetching groups ", error);
    return null;
  }
};
