import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { studentId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, email, phone } = await req.json();
    const s = await db.student.update({
      where: {
        id: studentId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    revalidatePath("/school/courses");
    revalidatePath(`/school/courses/${studentId}`);
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
  { params }: { params: { studentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { studentId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const s = await db.student.update({
      where: {
        id: studentId,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath("/school/courses");
    revalidatePath(`/school/courses/${studentId}`);
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
