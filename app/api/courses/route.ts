import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courses = await db.course.findMany({
      where: { schoolId: currentUser.schoolId },
      include: {
        userPerCourses: {
          include: {
            user: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(courses), {
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
