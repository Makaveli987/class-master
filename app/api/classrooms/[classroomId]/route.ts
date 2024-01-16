import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { classroomId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { classroomId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();
    const s = await db.classroom.update({
      where: {
        id: classroomId,
      },
      data: {
        name,
      },
    });

    revalidatePath("/school/classrooms");
    return new NextResponse(JSON.stringify(s), {
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
  { params }: { params: { classroomId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { classroomId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.classroom.update({
      where: {
        id: classroomId,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath(`/school/enrollments/`);
    return new NextResponse(JSON.stringify(note), {
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
