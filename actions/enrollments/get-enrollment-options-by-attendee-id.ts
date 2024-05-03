"use server";

import { ComboboxOptions } from "@/components/ui/combobox";
import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { string } from "zod";

export type StudentsOptionsResponse = {
  data: ComboboxOptions[];
  info?: string;
  error?: string;
};

export async function getEnrollmentOptionsByAttendeeId(
  attendeeId: string,
  userType: EnrollUserType | string
): Promise<StudentsOptionsResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { data: [], error: "Unauthorized" };
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        studentId: userType === EnrollUserType.STUDENT ? attendeeId : null,
        groupId: userType === EnrollUserType.GROUP ? attendeeId : null,
        archived: false,
      },
      select: {
        id: true,
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    const mappedEnrollments: ComboboxOptions[] = [];

    enrollments.forEach((enrollment) => {
      if (enrollment) {
        mappedEnrollments.push({
          value: enrollment.id,
          label: enrollment.course.name,
        });
      }
    });

    return { data: mappedEnrollments };
  } catch (error) {
    return { data: [], error: "Something went wrong" };
  }
}
