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
    },
  });

  if (enrollment?.attendedClasses! > 0) {
    // Decrement if Prev status was HELD and new is SCHEDULED or CANCELED
    if (
      schoolClass?.schoolClassStatus === ClassStatus.HELD &&
      classStatus !== ClassStatus.HELD
    ) {
      await db.enrollment.update({
        where: { id: enrollmentId },
        data: {
          attendedClasses: { decrement: 1 },
        },
      });
    }
  }

  // Increment if Prev status was not HELD and new one is HELD
  if (
    schoolClass?.schoolClassStatus !== ClassStatus.HELD &&
    classStatus === ClassStatus.HELD
  ) {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        attendedClasses: { increment: 1 },
      },
    });
  }
}
