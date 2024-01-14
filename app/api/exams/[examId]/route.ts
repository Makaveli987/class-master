import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { examId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { enrollmentId, name, result } = await req.json();
    const s = await db.exam.update({
      where: {
        id: examId,
      },
      data: {
        name,
        result,
      },
    });

    revalidatePath(`/school/enrollments/${enrollmentId}`);
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
  { params }: { params: { examId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { examId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.exam.delete({
      where: {
        id: examId,
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
