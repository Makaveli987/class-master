import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { teacherId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const s = await db.user.update({
      where: {
        id: teacherId,
      },
      data: {
        archived: true,
      },
    });

    const deleteCoursePeruser = await db.userPerCourse.deleteMany({
      where: {
        userId: teacherId,
      },
    });

    revalidatePath("/school/teachers");
    revalidatePath(`/school/teachers/${teacherId}`);
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

export async function PATCH(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { teacherId } = params;

    const { email, firstName, lastName, phone, role, dateOfBirth, active } =
      await req.json();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const s = await db.user.update({
      where: {
        id: teacherId,
      },
      data: {
        email,
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        phone,
        role,
        dateOfBirth,
        active,
      },
    });

    revalidatePath("/school/teachers");
    revalidatePath(`/school/teachers/${teacherId}`);
    return new NextResponse(JSON.stringify(s), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {}
}
