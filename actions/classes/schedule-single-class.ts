"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../get-current-user";
import { addMinutes } from "date-fns";
import { ClassStatus, SchoolClass } from "@prisma/client";
import { ClassType } from "@/lib/models/class-type";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";

type SingleClassPayload = {
  attendeeId: string;
  classroomId: string;
  enrollmentId: string;
  duration: string;
  substitutedTeacherId?: string;
  startDate: Date;
  type: EnrollUserType | string;
};

type SingleClassResponse = {
  data: SchoolClass;
  error?: string;
  message?: string;
};

export async function scheduleSingleClass(
  payload: SingleClassPayload
): Promise<SingleClassResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { data: {} as SchoolClass, error: "Unauthorized." };
    }

    const {
      attendeeId,
      classroomId,
      enrollmentId,
      duration,
      substitutedTeacherId,
      startDate,
      type,
    } = payload;

    if (
      !attendeeId ||
      !classroomId ||
      !enrollmentId ||
      !duration ||
      !startDate ||
      !type
    ) {
      return { data: {} as SchoolClass, error: "Missing required fields." };
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      select: {
        attendedClasses: true,
        scheduledClasses: true,
        totalClasses: true,
        completed: true,
      },
    });

    if (enrollment?.completed) {
      return {
        data: {} as SchoolClass,
        error: "Can't schedule class for completed enrollment.",
      };
    }

    if (
      enrollment?.scheduledClasses &&
      enrollment?.totalClasses &&
      enrollment?.scheduledClasses >= enrollment?.totalClasses
    ) {
      return {
        data: {} as SchoolClass,
        error:
          "You have reached a maximum amount of classes for this enrollment. If you need more classes please update enrollment options.",
      };
    }

    const group = await db.group.findUnique({
      where: { id: attendeeId },
      select: { students: { select: { studentId: true } } },
    });

    const onlineClassroom = await db.classroom.findFirst({
      where: { schoolId: currentUser?.schoolId, name: "Online" },
      select: {
        id: true,
      },
    });

    const isAvailable = await isClassTimeSlotAvailable(
      classroomId,
      startDate,
      addMinutes(new Date(startDate), Number(duration) - 1),
      onlineClassroom?.id
    );

    if (isAvailable) {
      const classData = await db.schoolClass.create({
        data: {
          enrollmentId,
          teacherId: currentUser.id,
          substitutedTeacherId: substitutedTeacherId || null,
          classroomId,
          schoolClassStatus: ClassStatus.SCHEDULED,
          studentId: type === ClassType.STUDENT ? attendeeId : null,
          groupId: type === ClassType.GROUP ? attendeeId : null,
          start: startDate,
          end: addMinutes(new Date(startDate), Number(duration) - 1),
          duration,
          schoolId: currentUser.schoolId,
        },
      });

      await db.enrollment.update({
        where: { id: enrollmentId },
        data: {
          scheduledClasses: { increment: 1 },
        },
      });

      // Create attendance
      if (group?.students) {
        const attendance = await Promise.all(
          group.students.map((student) =>
            db.attendance.create({
              data: {
                schoolClassId: classData.id,
                studentId: student.studentId,
                attended: false,
                schoolId: currentUser.schoolId,
                enrollmentId,
              },
            })
          )
        );
      }

      revalidatePath("/school/calendar");
      return { data: classData, message: "Class scheduled sucesfully." };
    } else {
      return {
        data: {} as SchoolClass,
        error: "Date already taken.",
      };
    }
  } catch (error) {
    return {
      data: {} as SchoolClass,
      error: "Something bad happened. Class were not scheduled",
    };
  }
}

async function isClassTimeSlotAvailable(
  classroomId: string,
  start: Date,
  end: Date,
  onlineClassroomId?: string
) {
  if (onlineClassroomId === classroomId) {
    return true;
  }
  const overlappingClasses = await db.schoolClass.findMany({
    where: {
      classroomId: classroomId,
      archived: false,
      OR: [
        {
          AND: [{ start: { lte: start } }, { end: { gte: start } }],
        },
        {
          AND: [{ start: { lte: end } }, { end: { gte: end } }],
        },
        {
          AND: [{ start: { gte: start } }, { end: { lte: end } }],
        },
      ],
    },
  });

  return overlappingClasses.length === 0;
}
