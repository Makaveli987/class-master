import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const s = await db.userPerCourse.delete({
      where: {
        id: params.id,
      },
    });

    // revalidatePath("/school/teachers");
    // revalidatePath(`/school/teachers/${teacherId}`);
    // revalidatePath("/school/courses");
    // revalidatePath(`/school/courses/${courseId}`);
    return new NextResponse(JSON.stringify(s), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
