"use server";

import { db } from "@/lib/db";
import getCurrentUser from "../get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { ComboboxOptions } from "@/components/ui/combobox";

export type CourseOptionsResponse = {
  data: ComboboxOptions[];
  info?: string;
  error?: string;
};

export async function getCourseOptions(
  userId: string,
  userType: EnrollUserType
): Promise<CourseOptionsResponse> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized.");
  }

  if (!userId) {
    throw new Error("Missing userId.");
  }

  if (!userType) {
    throw new Error("Missing userType.");
  }

  try {
    if (userType === EnrollUserType.GROUP) {
      const result = await db.enrollment.findMany({
        where: {
          groupId: userId,
          course: {
            archived: false,
          },
        },
        select: {
          id: true,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return mapCourseResponse(result, userType);
    }

    if (userType === EnrollUserType.STUDENT) {
      const result = await db.enrollment.findMany({
        where: {
          studentId: userId,
          course: {
            archived: false,
          },
        },
        select: {
          id: true,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return mapCourseResponse(result, userType);
    }

    return {
      error: "Something bad happened. Courses were not assigned",
      data: [],
    };
  } catch (error) {
    return {
      error: "Something bad happened. Courses were not assigned",
      data: [],
    };
  }
}

function mapCourseResponse(
  courses: { id: string; course: { id: string; name: string } }[],
  userType: EnrollUserType
): CourseOptionsResponse {
  const infoMessage = `This ${
    userType === EnrollUserType.GROUP ? "group" : "student"
  }  doesn't have any enrolled courses.`;

  if (!courses) {
    return { info: infoMessage, data: [] };
  }

  const options = courses.map((course) => ({
    value: course.id,
    label: course.course.name,
  }));

  return { data: options };
}
