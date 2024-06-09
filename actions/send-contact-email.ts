"use server";

import { sendContactEmail } from "@/lib/nodemailer";

export async function sendEmailFromContact(
  fullName: string,
  email: string,
  message: string
) {
  await sendContactEmail(fullName, email, message);
}
