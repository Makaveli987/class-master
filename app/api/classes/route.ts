import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { ClassStatus } from "@/lib/models/class-status";
import { ClassType } from "@/lib/models/class-type";
import { RepeatScheduleType } from "@/lib/models/repeat-schedule";

import { addDays, addMinutes, format, getHours, setHours } from "date-fns";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const skippedDates = [];
    const onlineClassroom = await db.classroom.findFirst({
      where: { schoolId: currentUser?.schoolId, name: "Online" },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      attendeeId,
      classroomId,
      enrollmentId,
      duration,
      originalTeacherId,
      substituteTeacherId,
      repeat,
      repeatConfig,
      startDate,
      type,
    } = await req.json();

    if (
      !attendeeId ||
      !classroomId ||
      !enrollmentId ||
      !duration ||
      !startDate ||
      !type
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const group = await db.group.findUnique({
      where: { id: attendeeId },
      select: { students: { select: { studentId: true } } },
    });

    // Reacuring classes same day/time each week
    if (
      repeat &&
      repeatConfig.repeatSchedule === RepeatScheduleType.SAME_TIME
    ) {
      const from = new Date(repeatConfig.range.from);
      const to = new Date(repeatConfig.range.to);

      let currentDay = from;

      while (currentDay <= to) {
        const isAvailable = await isClassTimeSlotAvailable(
          classroomId,
          currentDay,
          addMinutes(new Date(currentDay), Number(duration)),
          onlineClassroom?.id
        );

        if (isAvailable) {
          const classData = await db.schoolClass.create({
            data: {
              enrollmentId,
              originalTeacherId,
              substituteTeacherId: substituteTeacherId || null,
              classroomId,
              schoolClassStatus: ClassStatus.SCHEDULED,
              studentId: type === ClassType.STUDENT ? attendeeId : null,
              groupId: type === ClassType.GROUP ? attendeeId : null,
              start: currentDay,
              end: addMinutes(currentDay, Number(duration)),
              duration,
              schoolId: currentUser.schoolId,
            },
          });

          // Create attendance
          if (group?.students) {
            await Promise.all(
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
        } else {
          skippedDates.push(format(currentDay, "dd-MMM-yyyy HH:mm"));
        }

        currentDay = addDays(currentDay, 7);
      }
    }

    // Reacuring classes same day but different time each week
    if (repeat && repeatConfig.repeatSchedule === RepeatScheduleType.SHIFTS) {
      const from = new Date(repeatConfig.range.from);
      const to = new Date(repeatConfig.range.to);

      let isFirstWeek = true;
      let currentDay = from;
      const firstWeekTime = getHours(new Date(repeatConfig.firstWeekTime));
      const secondWeekTime = getHours(new Date(repeatConfig.secondWeekTime));

      while (currentDay <= to) {
        currentDay = isFirstWeek
          ? setHours(new Date(currentDay), firstWeekTime)
          : setHours(new Date(currentDay), secondWeekTime);

        const isAvailable = await isClassTimeSlotAvailable(
          classroomId,
          currentDay,
          addMinutes(new Date(currentDay), Number(duration)),
          onlineClassroom?.id
        );

        if (isAvailable) {
          const classData = await db.schoolClass.create({
            data: {
              enrollmentId,
              originalTeacherId,
              substituteTeacherId: substituteTeacherId || null,
              classroomId,
              schoolClassStatus: ClassStatus.SCHEDULED,
              studentId: type === ClassType.STUDENT ? attendeeId : null,
              groupId: type === ClassType.GROUP ? attendeeId : null,
              start: currentDay,
              end: addMinutes(currentDay, Number(duration)),
              duration,
              schoolId: currentUser.schoolId,
            },
          });

          // Create attendance
          if (group?.students) {
            await Promise.all(
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
        } else {
          skippedDates.push(format(currentDay, "dd-MMM-yyyy HH:mm"));
        }

        isFirstWeek = !isFirstWeek;
        currentDay = addDays(currentDay, 7);
      }
    }

    if (!repeat) {
      const isAvailable = await isClassTimeSlotAvailable(
        classroomId,
        startDate,
        addMinutes(new Date(startDate), Number(duration)),
        onlineClassroom?.id
      );

      if (isAvailable) {
        const classData = await db.schoolClass.create({
          data: {
            enrollmentId,
            originalTeacherId: originalTeacherId,
            substituteTeacherId: substituteTeacherId || null,
            classroomId,
            schoolClassStatus: ClassStatus.SCHEDULED,
            studentId: type === ClassType.STUDENT ? attendeeId : null,
            groupId: type === ClassType.GROUP ? attendeeId : null,
            start: startDate,
            end: addMinutes(new Date(startDate), Number(duration)),
            duration,
            schoolId: currentUser.schoolId,
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
      } else {
        return new NextResponse(
          JSON.stringify({ error: "Date already taken" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    revalidatePath("/school/calendar");
    if (skippedDates.length) {
      return new NextResponse(JSON.stringify({ skippedDates }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify("Class created!"), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
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
