"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../get-current-user";
import { ClassStatus } from "@prisma/client";

export async function deleteSchoolClass(
  schoolClassId: string,
  enrollmentId: string
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized.");
  }

  if (!schoolClassId) {
    throw new Error("Missing schoolClassId.");
  }

  try {
    const schoolClass = await db.schoolClass.update({
      where: {
        id: schoolClassId,
      },
      data: {
        archived: true,
      },
    });

    if (schoolClass.schoolClassStatus === ClassStatus.SCHEDULED) {
      await db.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          scheduledClasses: { decrement: 1 },
        },
      });
    }

    if (schoolClass.schoolClassStatus === ClassStatus.HELD) {
      await db.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          attendedClasses: { decrement: 1 },
          scheduledClasses: { decrement: 1 },
        },
      });
    }

    revalidatePath(`/school/calendar`);
    revalidatePath(`/school/enrollments`);
    revalidatePath(`/school/students`);
    revalidatePath(`/school/groups`);

    return { data: "Class removed!", message: "Class sucesfully removed." };
  } catch (error) {
    return {
      error: "Something bad happened. Class was not removed.",
    };
  }
}
