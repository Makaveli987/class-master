import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface DefaultConfigResponse {
  defaultPrice: number;
  defaultTotalClasses: number;
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { courseId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const defaultConfig: DefaultConfigResponse | null =
      await db.course.findFirst({
        where: {
          id: courseId,
        },
        select: {
          defaultPrice: true,
          defaultTotalClasses: true,
        },
      });

    return new NextResponse(JSON.stringify(defaultConfig), {
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
