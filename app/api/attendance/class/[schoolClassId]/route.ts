import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { Student } from "@prisma/client";
import { NextResponse } from "next/server";

export interface AttendanceResponse {
  id: string;
  attended: boolean;
  student: Pick<Student, "id" | "firstName" | "lastName">;
}

export async function GET(
  req: Request,
  { params }: { params: { schoolClassId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { schoolClassId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attendance = await db.attendance.findMany({
      where: {
        schoolClassId,
      },
      select: {
        id: true,
        attended: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify(attendance as AttendanceResponse[]),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
