import getCurrentUser from "@/actions/get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, teacherId, userId, courseGoals, userType } =
      await req.json();

    if (!courseId || !teacherId || !userId) {
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

    let enrollment = null;
    if (userType === EnrollUserType.GROUP) {
      enrollment = await db.enrollment.create({
        data: {
          courseId,
          teacherId,
          courseGoals,
          attendedClasses: 0,
          groupId: userId,
          schoolId: currentUser.schoolId,
        },
      });
      revalidatePath(`/school/groups/${userId}`);
    } else {
      enrollment = await db.enrollment.create({
        data: {
          courseId,
          teacherId,
          courseGoals,
          attendedClasses: 0,
          studentId: userId,
          schoolId: currentUser.schoolId,
        },
      });
      revalidatePath(`/school/students/${userId}`);
    }

    return new NextResponse(JSON.stringify(enrollment), {
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
