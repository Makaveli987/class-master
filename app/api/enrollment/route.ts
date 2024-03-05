import getCurrentUser from "@/actions/get-current-user";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

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

    if (!courseId || !teacherId || !userId) {
      return new NextResponse(
        JSON.stringify({ error: { message: "Missing required fields" } }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let enrollment = null;

    if (userType === EnrollUserType.GROUP) {
      const group = await db.group.findUnique({
        where: { id: userId },
        select: { isCompanyGroup: true, active: true, students: true },
      });

      if (!group?.active) {
        return new NextResponse(
          JSON.stringify({
            error: { message: "Cannot enroll inactive group!" },
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (group?.isCompanyGroup) {
        enrollment = await db.enrollment.create({
          data: {
            courseId,
            teacherId,
            courseGoals,
            groupId: userId,
            schoolId: currentUser.schoolId,
            price,
            totalClasses,
          },
        });
      } else {
        let totalPrice = 0;

        if (group?.students?.length) {
          // Price here is represented as Price Per Student because group is not Company
          totalPrice = price * group?.students?.length;
        }
        enrollment = await db.enrollment.create({
          data: {
            courseId,
            teacherId,
            courseGoals,
            groupId: userId,
            schoolId: currentUser.schoolId,
            price: totalPrice,
            pricePerStudent: price,
            totalClasses,
          },
        });
      }

      revalidatePath(`/school/groups/${userId}`);
    } else {
      const student = await db.student.findUnique({
        where: { id: userId },
        select: { active: true },
      });

      if (!student?.active) {
        return new NextResponse(
          JSON.stringify({
            error: { message: "Cannot enroll inactive student!" },
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      enrollment = await db.enrollment.create({
        data: {
          courseId,
          teacherId,
          courseGoals,
          studentId: userId,
          schoolId: currentUser.schoolId,
          price,
          totalClasses,
        },
      });
      revalidatePath(`/school/students/${userId}`);
    }

    return new NextResponse(JSON.stringify(enrollment), {
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
