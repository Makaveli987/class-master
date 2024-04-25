"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas/login-schema";
import { getUserByEmail } from "../get-user";
import { generateVerificationToken } from "../verification-token/generate-verification-token";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Invalid credentials!", code: 950 };
  }

  if (!existingUser.active || existingUser.archived) {
    return { error: "Inactive user!", code: 950 };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      "darko.vidic2@gmail.com",
      verificationToken.token
    );

    return { error: "Email not verified", code: 951 };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
