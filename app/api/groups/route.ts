import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, studentIds } = await req.json();

    if (!name) {
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

    const result = await db.$transaction(async (tx) => {
      // Step 1: Create the group
      const group = await tx.group.create({
        data: {
          name,
          schoolId: currentUser.schoolId,
          // other fields if necessary
        },
      });

      // Step 2: Attach each student to the group
      await Promise.all(
        studentIds.map((studentId: string) =>
          tx.studentToGroup.create({
            data: {
              groupId: group.id,
              studentId,
            },
          })
        )
      );

      return group; // return the created group
    });

    revalidatePath("/school/groups");

    return new NextResponse(JSON.stringify(result), {
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
        groupId: { not: null },
        archived: false,
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
      },
    });

    const mappedStudents = enrollments.map((enrollment) => ({
      value: enrollment.group?.id,
      label: enrollment.group?.name,
    }));

    return new NextResponse(JSON.stringify(mappedStudents), {
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
