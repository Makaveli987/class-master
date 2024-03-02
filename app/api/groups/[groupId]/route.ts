import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
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
      const group = await tx.group.update({
        where: {
          id: params.groupId,
        },
        data: {
          name,
          isCompanyGroup,
        },
      });

      const groupStudents = await tx.studentToGroup.findMany({
        where: {
          groupId: params.groupId,
        },
      });

      if (groupStudents) {
        const studentsToBeRemoved = groupStudents
          .filter((student) => !studentIds.includes(student.studentId))
          .map((student) => student.studentId);

        // Remove students
        await tx.studentToGroup.deleteMany({
          where: {
            studentId: { in: studentsToBeRemoved },
            groupId: group.id,
          },
        });

        const groupStudentIds = groupStudents.map(
          (student) => student.studentId
        );

        const studentsToAdd = studentIds.filter(
          (id: string) => !groupStudentIds.includes(id)
        );

        // Add students
        await Promise.all(
          studentsToAdd.map(async (studentId: string) => {
            return tx.studentToGroup.create({
              data: {
                studentId: studentId,
                groupId: group.id,
              },
            });
          })
        );
      }
    });

    revalidatePath("/school/groups");
    revalidatePath(`/school/groups/${params.groupId}`);
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

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { groupId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const group = await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath("/school/groups");
    return new NextResponse(JSON.stringify(group), {
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
