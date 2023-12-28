import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
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

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description, pricePerClass, totalClasses } = await req.json();
    const s = await db.course.create({
      data: {
        name,
        description,
        pricePerClass,
        totalClasses,
        schoolId: currentUser.schoolId,
      },
    });
    revalidatePath("/school/courses");

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
