import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { ClassStatus } from "@/lib/models/class-status";
import { ClassType } from "@/lib/models/class-type";
import { RepeatScheduleType } from "@/lib/models/repeat-schedule";

import {
  addDays,
  addMinutes,
  getDay,
  getHours,
  isSameWeek,
  setHours,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      attendeeId,
      classroomId,
      courseId,
      duration,
      originalTeacherId,
      substituteTeacherId,
      repeat,
      repeatConfig,
      substitute,
      startDate,
      type,
    } = await req.json();

    if (
      !attendeeId ||
      !classroomId ||
      !courseId ||
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

    if (
      repeat &&
      repeatConfig.repeatSchedule === RepeatScheduleType.SAME_TIME
    ) {
      const from = new Date(repeatConfig.range.from);
      const to = new Date(repeatConfig.range.to);

      let currentDay = from;

      while (currentDay <= to) {
        const classData = await db.schoolClass.create({
          data: {
            courseId,
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

        currentDay = addDays(currentDay, 7);
      }
    }

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

        const classData = await db.schoolClass.create({
          data: {
            courseId,
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

        isFirstWeek = !isFirstWeek;
        currentDay = addDays(currentDay, 7);
      }
    }

    if (!repeat) {
      const classData = await db.schoolClass.create({
        data: {
          courseId,
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
    }

    revalidatePath("/school/calendar");

    return new NextResponse(JSON.stringify("success"), {
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
