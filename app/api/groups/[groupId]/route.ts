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
      // Step 1: Update the group
      const group = await tx.group.update({
        where: {
          id: params.groupId,
        },
        data: {
          name,
        },
      });

      // Remove students from group
      const groupStudents = await tx.student.findMany({
        where: {
          groupId: params.groupId,
        },
      });

      if (groupStudents) {
        const studentsToBeRemoved = groupStudents.filter(
          (student) =>
            !studentIds.some((studentId: string) => student.id === studentId)
        );

        await Promise.all(
          studentsToBeRemoved.map((student) =>
            tx.student.update({
              where: {
                id: student.id,
              },
              data: {
                groupId: null,
              },
            })
          )
        );
      }

      // Step 2: Add students to group
      await Promise.all(
        studentIds.map((studentId: string) =>
          tx.student.update({
            where: {
              id: studentId,
            },
            data: {
              groupId: group.id,
            },
          })
        )
      );

      return group;
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

    const result = await db.$transaction(async (tx) => {
      // Step 1: Create the group
      const group = await tx.group.update({
        where: {
          id: groupId,
        },
        data: {
          archived: true,
        },
      });

      await tx.student.updateMany({
        where: {
          groupId: groupId,
        },
        data: {
          groupId: null,
        },
      });

      return group;
    });

    revalidatePath("/school/groups");
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
