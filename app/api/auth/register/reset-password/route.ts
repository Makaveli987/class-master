import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const { teacherId, password } = await req.json();
    console.log({ teacherId });
    console.log({ password });

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const s = await db.user.update({
      where: {
        id: teacherId,
      },
      data: {
        hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify(s), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {}
}
