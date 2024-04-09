import { db } from "@/lib/db";
import { ClassStatus } from "@prisma/client";
import { NextResponse } from "next/server";

async function updateClass(schoolClassId: string, classStatus: ClassStatus) {
  await db.schoolClass.update({
    where: {
      id: schoolClassId,
    },
    data: {
      schoolClassStatus: classStatus,
    },
  });
}

export async function updateAttendedClass(
  schoolClassId: string,
  enrollmentId: string,
  classStatus: string
) {
  const schoolClass = await db.schoolClass.findFirst({
    where: { id: schoolClassId },
  });

  if (schoolClass?.schoolClassStatus === classStatus) {
    return true;
  }

  const enrollment = await db.enrollment.findFirst({
    where: {
      id: enrollmentId,
    },
    select: {
      attendedClasses: true,
      scheduledClasses: true,
      totalClasses: true,
    },
  });

  // SCHEDULED --> HELD
  if (
    schoolClass?.schoolClassStatus === ClassStatus.SCHEDULED &&
    classStatus === ClassStatus.HELD
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { increment: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }

  // SCHEDULED --> CANCELED
  if (
    schoolClass?.schoolClassStatus === ClassStatus.SCHEDULED &&
    classStatus === ClassStatus.CANCELED
  ) {
    if (enrollment?.scheduledClasses! > 0) {
    }
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        scheduledClasses: { decrement: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }

  // HELD --> SCHEDULED
  if (
    schoolClass?.schoolClassStatus === ClassStatus.HELD &&
    classStatus === ClassStatus.SCHEDULED
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { decrement: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }

  // HELD --> CANCELED
  if (
    schoolClass?.schoolClassStatus === ClassStatus.HELD &&
    classStatus === ClassStatus.CANCELED
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { decrement: 1 },
        scheduledClasses: { decrement: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }

  // CANCELED --> SCHEDULED
  if (
    schoolClass?.schoolClassStatus === ClassStatus.CANCELED &&
    classStatus === ClassStatus.SCHEDULED
  ) {
    if (enrollment?.scheduledClasses === enrollment?.totalClasses) {
      return false;
    }

    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        scheduledClasses: { increment: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }

  // CANCELED --> HELD
  if (
    schoolClass?.schoolClassStatus === ClassStatus.CANCELED &&
    classStatus === ClassStatus.HELD
  ) {
    if (enrollment?.scheduledClasses === enrollment?.totalClasses) {
      return false;
    }

    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { increment: 1 },
        scheduledClasses: { increment: 1 },
      },
    });

    await updateClass(schoolClassId, classStatus);

    return true;
  }
}
