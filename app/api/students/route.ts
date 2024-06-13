import getCurrentUser from "@/actions/get-current-user";
import { ComboboxOptions } from "@/components/ui/combobox";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, email, phone, dateOfBirth } = await req.json();

    if (!firstName || !lastName || !email || !phone) {
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

    const s = await db.student.create({
      data: {
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        email,
        phone,
        dateOfBirth,
        schoolId: currentUser.schoolId,
      },
    });
    revalidatePath("/school/students");

    return new NextResponse(JSON.stringify(s), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("eror :>> ", error);
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

export async function GET(req: NextRequest) {
  const substituteTeacher = req.nextUrl.searchParams.get("substituteTeacher");
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: {
        schoolId: currentUser?.schoolId,
        teacherId: substituteTeacher ? substituteTeacher : currentUser?.id,
        studentId: { not: null },
        groupId: null,
        archived: false,
      },
      include: {
        student: {
          where: { archived: false },
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    const mappedStudents: ComboboxOptions[] = [];

    enrollments.forEach((enrollment) => {
      if (enrollment.student) {
        mappedStudents.push({
          value: enrollment.student?.id,
          label: `${enrollment.student?.firstName} ${enrollment.student?.lastName}`,
        });
      }
    });

    return new NextResponse(JSON.stringify(mappedStudents), {
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
