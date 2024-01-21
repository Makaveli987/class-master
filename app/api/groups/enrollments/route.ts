import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export interface GroupedEnrollment {
  atendeeId: string;
  courses: { value: string; label: string }[];
}

export async function GET(req: NextRequest) {
  const substituteTeacher = req.nextUrl.searchParams.get("substituteTeacher");
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        teacherId: substituteTeacher ? substituteTeacher : currentUser?.id,
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
        course: true,
      },
    });

    const groupedEnrollments = enrollments.reduce(
      (acc: Record<string, GroupedEnrollment>, enrollment) => {
        const courseInfo = {
          value: enrollment.courseId,
          label: enrollment.course.name,
        };

        if (enrollment.group) {
          const atendeeId = enrollment.group.id;
          if (!acc[atendeeId]) {
            acc[atendeeId] = {
              atendeeId: atendeeId,
              courses: [courseInfo],
            };
          } else {
            acc[atendeeId].courses.push(courseInfo);
          }
        }

        return acc;
      },
      {}
    );

    const result = Object.values(groupedEnrollments);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
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
