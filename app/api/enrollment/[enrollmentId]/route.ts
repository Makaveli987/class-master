import getCurrentUser from "@/actions/get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { enrollmentId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      courseId,
      teacherId,
      userId,
      courseGoals,
      userType,
      price,
      totalClasses,
    } = await req.json();

    if (!courseId || !teacherId || !userId || !userType) {
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
    const group = await db.group.findUnique({
      where: { id: userId },
      select: { isCompanyGroup: true, students: true },
    });

    let enrollment = null;

    if (userType === EnrollUserType.GROUP) {
      // Calculate total price and add price per group for individual groups
      if (group?.isCompanyGroup) {
        console.log("isCompany :>> ");
        enrollment = await db.enrollment.update({
          where: {
            id: enrollmentId,
          },
          data: {
            courseId,
            teacherId,
            courseGoals,
            groupId: userId,
            price,
            totalClasses,
          },
        });
      } else {
        let totalPrice = 0;

        console.log("group.students :>> ", group?.students);

        if (group?.students?.length) {
          // Price here is represented as Price Per Student because group is not Company
          totalPrice = price * group.students.length;
        }
        enrollment = await db.enrollment.update({
          where: {
            id: enrollmentId,
          },
          data: {
            courseId,
            teacherId,
            courseGoals,
            groupId: userId,
            price: totalPrice,
            pricePerStudent: price,
            totalClasses,
          },
        });
      }

      revalidatePath(`/school/groups/${userId}`);
    } else {
      enrollment = await db.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
          courseId,
          teacherId,
          courseGoals,
          studentId: userId,
          price,
          totalClasses,
        },
      });
      revalidatePath(`/school/students/${userId}`);
    }

    revalidatePath("/school/enrollment");
    revalidatePath(`/school/enrollment/${enrollmentId}`);
    return new NextResponse(JSON.stringify(enrollment), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error :>> ", error);
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
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { enrollmentId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedEnrollment = await db.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        archived: true,
      },
    });

    revalidatePath(`/school/enrollment/${enrollmentId}`);
    return new NextResponse(JSON.stringify(deletedEnrollment), {
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
