import { db } from "@/lib/db";
import { ClassStatus } from "@prisma/client";

export async function updateAttendedClass(
  schoolClassId: string,
  enrollmentId: string,
  classStatus: string
) {
  const schoolClass = await db.schoolClass.findFirst({
    where: { id: schoolClassId },
  });

  const enrollment = await db.enrollment.findFirst({
    where: {
      id: enrollmentId,
    },
    select: {
      attendedClasses: true,
      scheduledClasses: true,
    },
  });

  // if (enrollment?.attendedClasses! > 0) {

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

    return;
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

    return;
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

    return;
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

    return;
  }

  // CANCELED --> SCHEDULED
  if (
    schoolClass?.schoolClassStatus === ClassStatus.CANCELED &&
    classStatus === ClassStatus.SCHEDULED
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        scheduledClasses: { increment: 1 },
      },
    });

    return;
  }

  // CANCELED --> HELD
  if (
    schoolClass?.schoolClassStatus === ClassStatus.CANCELED &&
    classStatus === ClassStatus.HELD
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { increment: 1 },
        scheduledClasses: { increment: 1 },
      },
    });

    return;
  }
  // }

  // // Increment if Prev status was not CANCELED and new one is HELD or SCHEDULED
  // if (
  //   schoolClass?.schoolClassStatus === ClassStatus.CANCELED &&
  //   classStatus !== ClassStatus.HELD
  // ) {
  //   await db.enrollment.update({
  //     where: { id: enrollmentId },
  //     data: {
  //       attendedClasses: { increment: 1 },
  //     },
  //   });
  // }
}
