import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, teacherId } = await req.json();

    if (!courseId || !teacherId) {
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

    const s = await db.userPerCourse.create({
      data: {
        courseId,
        userId: teacherId,
      },
    });
    revalidatePath(`/school/teachers/${teacherId}`);
    revalidatePath(`/school/courses/${courseId}`);

    return new NextResponse(JSON.stringify(s), {
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
