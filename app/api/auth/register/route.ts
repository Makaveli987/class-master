import { generateVerificationToken } from "@/actions/verification-token/generate-verification-token";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { getRandomColor, userColors } from "@/lib/user-colors";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      schoolName,
      dateOfBirth,
    } = await request.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role ||
      !schoolName
    ) {
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

    const school = await db.school.create({
      data: {
        name: schoolName,
      },
    });

    const color = await getRandomColor();

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        email,
        hashedPassword,
        phone,
        role,
        dateOfBirth,
        schoolId: school.id,
        color,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      user.firstName
    );

    await db.classroom.create({
      data: {
        name: "Online",
        schoolId: school.id,
      },
    });

    await db.assignedColors.create({
      data: { userId: user.id, schooldId: school.id, color },
    });

    // Return the created user
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
