import getCurrentUser from "@/actions/get-current-user";
import { ComboboxOptions } from "@/components/ui/combobox";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, studentIds, isCompanyGroup } = await req.json();

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
          isCompanyGroup,
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
        studentId: null,
        archived: false,
      },
      include: {
        group: {
          where: {
            archived: false,
          },
          select: { id: true, name: true },
        },
      },
    });

    const mappedGroups: ComboboxOptions[] = [];

    enrollments.forEach((enrollment) => {
      if (enrollment.group) {
        mappedGroups.push({
          value: enrollment.group?.id,
          label: enrollment.group?.name,
        });
      }
    });

    // const enrollmentss = await db.enrollment.findMany({
    //   where: {
    //     schoolId: currentUser?.schoolId,
    //     teacherId: substituteTeacher ? substituteTeacher : currentUser?.id,
    //     studentId: { not: null },
    //     groupId: null,
    //     archived: false,
    //   },
    //   include: {
    //     student: {
    //       select: { id: true, firstName: true, lastName: true },
    //     },
    //   },
    // });

    // const mappedStudents = enrollments.map((enrollment) => ({
    //   value: enrollment.student?.id,
    //   label: `${enrollment.student?.firstName} ${enrollment.student?.lastName}`,
    // }));

    return new NextResponse(JSON.stringify(mappedGroups), {
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
