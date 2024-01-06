import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { enrollmentId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, teacherId, studentId, courseGoals } = await req.json();

    if (!courseId || !teacherId || !studentId) {
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
    const enrollment = await db.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        courseId,
        teacherId,
        studentId,
        courseGoals,
      },
    });

    revalidatePath("/school/enrollment");
    revalidatePath(`/school/enrollment/${enrollmentId}`);
    return new NextResponse(JSON.stringify(enrollment), {
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
