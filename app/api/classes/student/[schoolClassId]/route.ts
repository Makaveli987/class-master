import getCurrentUser from "@/actions/get-current-user";
import { updateAttendedClass } from "@/actions/update-attended-classes";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { db } from "@/lib/db";
import { ClassStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface UpdateClassPayload {
  description?: string;
  note?: string;
  noteId?: string;
  classStatus: ClassStatus;
  enrollmentId: string;
  userId: string;
  userType: EnrollUserType;
}

export async function PATCH(
  req: Request,
  { params }: { params: { schoolClassId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { schoolClassId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      description,
      note,
      noteId,
      classStatus,
      enrollmentId,
      userId,
      userType,
    }: UpdateClassPayload = await req.json();

    if (currentUser.id !== userId && currentUser.role === Role.TEACHER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    let isStatusUpdated = undefined;

    const result = await db.$transaction(async (tx) => {
      isStatusUpdated = await updateAttendedClass(
        schoolClassId,
        enrollmentId,
        classStatus
      );

      await db.schoolClass.update({
        where: {
          id: schoolClassId,
        },
        data: {
          description,
          // schoolClassStatus: classStatus,
        },
      });

      if (note && !noteId) {
        await db.note.create({
          data: {
            enrollmentId,
            teacherId: currentUser.id,
            studentId: userType === EnrollUserType.STUDENT ? userId : null,
            groupId: userType === EnrollUserType.GROUP ? userId : null,
            text: note,
            userId,
            schoolClassId,
          },
        });
      }

      if (note && noteId) {
        await db.note.update({
          where: { id: noteId },
          data: {
            text: note,
          },
        });
      }
    });

    if (!isStatusUpdated) {
      throw new Error(
        "Unable to change the status. This enrollment alredy has maximum amount of classes."
      );
    }

    revalidatePath("/school/calendar");
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("[UpdateClassPayload] Error ", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
