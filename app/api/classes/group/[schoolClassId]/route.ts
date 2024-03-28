import getCurrentUser from "@/actions/get-current-user";
import { updateAttendedClass } from "@/actions/update-attended-classes";
import { db } from "@/lib/db";
import { ClassStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface AttendancePayload {
  attendanceId: string;
  studentId: string;
  attended: boolean;
  noteContent: string;
  noteId?: string;
}

export interface UpdateClassGroupPayload {
  description?: string;
  attendees: AttendancePayload[];
  classStatus: ClassStatus;
  enrollmentId: string;
  userId: string;
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
      attendees,
      classStatus,
      enrollmentId,
      userId,
    }: UpdateClassGroupPayload = await req.json();

    const result = await db.$transaction(async (tx) => {
      // const currentClassStatus = await db.schoolClass.findUnique({
      //   where: {id: schoolClassId}, select: {
      //     schoolClassStatus: true
      //   }
      // })

      const isStatusUpdated = await updateAttendedClass(
        schoolClassId,
        enrollmentId,
        classStatus
      );

      if (!isStatusUpdated) {
        throw new Error(
          "Unable to change the status. This enrollment alredy has maximum amount of classes."
        );
      }

      const dataForUpdate: {
        description?: string;
        schoolClassStatus?: ClassStatus;
      } = {
        description,
      };

      if (isStatusUpdated) {
        dataForUpdate.schoolClassStatus = classStatus;
      }

      const updatedClass = await db.schoolClass.update({
        where: {
          id: schoolClassId,
        },
        data: {
          ...dataForUpdate,
        },
      });

      // Step 2: Update attendance for students
      await Promise.all(
        attendees.map((attendee: AttendancePayload) =>
          tx.attendance.update({
            where: {
              id: attendee.attendanceId,
            },
            data: {
              attended: attendee.attended,
            },
          })
        )
      );

      // Step 3: Create or update student notes
      await Promise.all(
        attendees.map((item: AttendancePayload) => {
          if (item.noteContent && !item.noteId) {
            return tx.note.create({
              data: {
                userId: item.studentId,
                teacherId: currentUser.id,
                text: item.noteContent,
                schoolClassId,
                enrollmentId,
              },
            });
          }

          if (item.noteContent && item.noteId) {
            return tx.note.update({
              where: { id: item.noteId },
              data: {
                text: item.noteContent,
              },
            });
          }
        })
      );

      return updatedClass; // return the created group
    });

    revalidatePath("/school/calendar");
    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
