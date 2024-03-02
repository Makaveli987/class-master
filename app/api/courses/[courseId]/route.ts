import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { courseId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      name,
      description,
      defaultPrice,
      defaultGroupPrice,
      defaultPricePerStudent,
      defaultTotalClasses,
    } = await req.json();
    const s = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        name,
        description,
        defaultPrice,
        defaultGroupPrice,
        defaultPricePerStudent,
        defaultTotalClasses,
      },
    });

    revalidatePath("/school/courses");
    revalidatePath(`/school/courses/${courseId}`);
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
  { params }: { params: { courseId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { courseId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const s = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath("/school/courses");
    revalidatePath(`/school/courses/${courseId}`);
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
