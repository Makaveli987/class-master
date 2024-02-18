import { SchoolClassResponse } from "@/actions/get-classes";
import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { ClassStatus } from "@/lib/models/class-status";
import { ClassType } from "@/lib/models/class-type";
import { RepeatScheduleType } from "@/lib/models/repeat-schedule";
import { getCurrentWeekRange } from "@/lib/utils";

import {
  addDays,
  addMinutes,
  endOfWeek,
  format,
  getHours,
  setHours,
  startOfWeek,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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
      teacherId,
      substitutedTeacherId,
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
              teacherId: currentUser.id,
              substitutedTeacherId: substitutedTeacherId || null,
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
              teacherId: currentUser.id,
              substitutedTeacherId: substitutedTeacherId || null,
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
            teacherId: currentUser.id,
            substitutedTeacherId: substitutedTeacherId || null,
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
          AND: [{ start: { lt: start } }, { end: { gt: start } }],
        },
        {
          AND: [{ start: { lt: end } }, { end: { gt: end } }],
        },
        {
          AND: [{ start: { gt: start } }, { end: { lt: end } }],
        },
      ],
    },
  });

  return overlappingClasses.length === 0;
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    const { currentDate, startOfWeekDate, endOfWeekDate } =
      getCurrentWeekRange();

    const startDateParam = req.nextUrl.searchParams.get("startDate");
    const endDateParam = req.nextUrl.searchParams.get("endDate");
    const teacherIdParam = req.nextUrl.searchParams.get("teacherId");
    const classroomIdParam = req.nextUrl.searchParams.get("classroomId");

    const startDate = startDateParam
      ? new Date(startDateParam)
      : startOfWeekDate;
    const endDate = endDateParam ? new Date(endDateParam) : endOfWeekDate;
    const teacherId = teacherIdParam || null;
    const classroomId = classroomIdParam || null;

    // Build the where clause based on provided parameters
    const whereClause: Record<string, any> = {
      schoolId: currentUser?.schoolId,
    };

    if (startDate && endDate) {
      whereClause.start = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (teacherId) {
      whereClause.teacherId = teacherId;
    }

    if (classroomId) {
      whereClause.classroomId = classroomId;
    }

    const classes = await db.schoolClass.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            color: true,
          },
        },
        substitutedTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            color: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // const att = await db.attendance.deleteMany({
    //   where: {
    //     schoolId: currentUser?.schoolId,
    //   },
    // });
    // const classes = await db.schoolClass.deleteMany({
    //   where: {
    //     schoolId: currentUser?.schoolId,
    //   },
    // });

    return new NextResponse(JSON.stringify(classes as SchoolClassResponse[]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error :>> ", error);
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
