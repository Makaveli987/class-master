"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getCurrentUser from "../get-current-user";

export async function completeEnrollment(
  enrollmentId: string,
  completed: boolean
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      error: "Unauthorized",
    };
  }

  if (!enrollmentId) {
    return { error: "Missing enrollmentId" };
  }

  const enrollment = await db.enrollment.findFirst({
    where: {
      id: enrollmentId,
    },
  });

  if (!completed) {
    try {
      const enrollment = await db.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          completed: completed,
        },
      });
      revalidatePath(`/school/enrollments/${enrollmentId}`);

      return { data: enrollment, message: "Enrollment status updated." };
    } catch (error) {
      return {
        error: "Something bad happened. Enrollment status was not updated.",
      };
    }
  }

  if (enrollment?.completed) {
    return {
      warning: "Course already completed.",
    };
  }

  if (enrollment?.attendedClasses! < enrollment?.totalClasses!) {
    return {
      error: `Cannot complete course. ${
        enrollment?.groupId ? "Group" : "Student"
      } did not attended all classes.`,
    };
  }

  if (enrollment?.attendedClasses! > enrollment?.totalClasses!) {
    return { error: "Cannot complete course. Something went wrong." };
  }

  try {
    const enrollment = await db.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        completed: completed,
      },
    });
    revalidatePath(`/school/enrollments/${enrollmentId}`);

    return { data: enrollment, message: "Enrollment completed." };
  } catch (error) {
    return { error: "Something bad happened. Enrollment was not completed." };
  }
}
