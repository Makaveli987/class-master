"use server";
import { db } from "@/lib/db";
import { ClassType } from "@/lib/models/class-type";
import { recurringClassSchema } from "@/schemas/recurring-class-schema";
import { ClassStatus, SchoolClass } from "@prisma/client";
import { addDays, addMinutes, format } from "date-fns";
import { z } from "zod";
import getCurrentUser from "../get-current-user";

export async function createRecurringEvents(
  payload: z.infer<typeof recurringClassSchema>
) {
  try {
    const currentUser = await getCurrentUser();

    let group = null;

    if (!currentUser) {
      return { data: {} as SchoolClass, error: "Unauthorized." };
    }

    const {
      attendeeId,
      classroomId,
      duration,
      enrollmentId,
      range,
      scheduleConfig,
      type,
      substitutedTeacherId,
    } = payload;

    if (
      !attendeeId ||
      !classroomId ||
      !enrollmentId ||
      !duration ||
      !range ||
      !type
    ) {
      return { data: {} as SchoolClass, error: "Missing required fields." };
    }

    const skippedDates = [];

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

    let scheduledClassesAmount = enrollment?.scheduledClasses || 0;

    if (enrollment?.completed) {
      return {
        data: {} as SchoolClass,
        error: "Cannot schedule class for completed enrollment",
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

    const onlineClassroom = await db.classroom.findFirst({
      where: { schoolId: currentUser?.schoolId, name: "Online" },
      select: {
        id: true,
      },
    });

    if (type === ClassType.GROUP) {
      group = await db.group.findUnique({
        where: { id: attendeeId },
        select: { students: { select: { studentId: true } } },
      });
    }

    // Reacuring classes same day/time each week
    if (!scheduleConfig.shifts) {
      const from = new Date(range.from);
      const to = new Date(range.to);

      let currentDay = from;
      currentDay.setHours(scheduleConfig.firstWeek.startTime.getHours());
      currentDay.setMinutes(scheduleConfig.firstWeek.startTime.getMinutes());

      console.log("currentDay", currentDay);

      while (currentDay <= to) {
        const isAvailable = await isClassTimeSlotAvailable(
          classroomId,
          currentDay,
          addMinutes(new Date(currentDay), Number(parseInt(duration) - 1)),
          onlineClassroom?.id
        );

        if (
          enrollment?.totalClasses &&
          scheduledClassesAmount >= enrollment?.totalClasses
        ) {
          return {
            data: {} as SchoolClass,
            error:
              "You have reached a maximum amount of classes for this enrollment. Some classes were not scheduled.",
          };
        }

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
              start: currentDay,
              end: addMinutes(currentDay, Number(parseInt(duration) - 1)),
              duration,
              schoolId: currentUser.schoolId,
            },
          });

          await await updateScheduledClasses(enrollmentId);
          scheduledClassesAmount++;

          if (group) {
            await createAttendance(
              group,
              classData.id,
              currentUser.schoolId,
              enrollmentId
            );
          }
        } else {
          skippedDates.push(format(currentDay, "dd-MMM-yyyy HH:mm"));
        }

        currentDay = addDays(currentDay, 7);
      }
    } else {
      const from = new Date(range.from);
      const to = new Date(range.to);

      let currentDay = from;
      let isFirstWeek = true;

      while (currentDay <= to) {
        if (isFirstWeek) {
          currentDay.setHours(scheduleConfig.firstWeek.startTime.getHours());
          currentDay.setMinutes(
            scheduleConfig.firstWeek.startTime.getMinutes()
          );
        } else {
          // @ts-ignore
          currentDay.setHours(scheduleConfig.secondWeek.startTime.getHours());
          currentDay.setMinutes(
            // @ts-ignore
            scheduleConfig.secondWeek.startTime.getMinutes()
          );
        }

        const isAvailable = await isClassTimeSlotAvailable(
          classroomId,
          currentDay,
          addMinutes(new Date(currentDay), Number(parseInt(duration) - 1)),
          onlineClassroom?.id
        );

        if (
          enrollment?.totalClasses &&
          scheduledClassesAmount >= enrollment?.totalClasses
        ) {
          return {
            data: {} as SchoolClass,
            error:
              "You have reached a maximum amount of classes for this enrollment. Some classes were not scheduled.",
          };
        }

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
              start: currentDay,
              end: addMinutes(currentDay, Number(parseInt(duration) - 1)),
              duration,
              schoolId: currentUser.schoolId,
            },
          });

          await updateScheduledClasses(enrollmentId);
          scheduledClassesAmount++;

          if (group) {
            await createAttendance(
              group,
              classData.id,
              currentUser.schoolId,
              enrollmentId
            );
          }
        } else {
          skippedDates.push(format(currentDay, "dd-MMM-yyyy HH:mm"));
        }

        currentDay = addDays(currentDay, 7);
        isFirstWeek = !isFirstWeek;
      }
    }
  } catch (error) {
    console.error("error", error);
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

async function updateScheduledClasses(enrollmentId: string) {
  await db.enrollment.update({
    where: { id: enrollmentId },
    data: {
      scheduledClasses: { increment: 1 },
    },
  });
}

async function createAttendance(
  group: any,
  classId: string,
  schoolId: string,
  enrollmentId: string
) {
  await Promise.all(
    group.students.map((student: any) =>
      db.attendance.create({
        data: {
          schoolClassId: classId,
          studentId: student.studentId,
          attended: false,
          schoolId: schoolId,
          enrollmentId,
        },
      })
    )
  );
}
