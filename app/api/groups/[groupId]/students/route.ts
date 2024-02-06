import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface GroupStudentsResponse {
  id: string;
  firstName: string;
  lastName: string;
}

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { groupId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const students = await db.student.findMany({
      where: {
        group: {
          some: {
            groupId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return new NextResponse(
      JSON.stringify(students as GroupStudentsResponse[]),
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
