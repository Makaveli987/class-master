import getCurrentUser from "@/actions/get-current-user";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone, roleId } =
      await request.json();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!firstName || !lastName || !email || !password || !phone || !roleId) {
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

    // Check if the email is already used
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        roleId,
        schoolId: currentUser.schoolId,
      },
    });

    user.hashedPassword = "";

    revalidatePath("/school/courses");

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in POST function:", error);
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
