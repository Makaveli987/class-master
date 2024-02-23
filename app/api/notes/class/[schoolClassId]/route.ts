import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export interface NoteResponse {
  id: string;
  // student id
  userId: string;
  text: string;
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

    const notes = await db.note.findMany({
      where: {
        schoolClassId,
      },
      select: {
        id: true,
        userId: true,
        text: true,
      },
    });

    return new NextResponse(JSON.stringify(notes as NoteResponse[]), {
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
