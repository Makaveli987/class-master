"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import getCurrentUser from "../get-current-user";

type CreatePaymentPayload = {
  enrollmentId: string;
  userId: string;
  userName: string;
  amount: number;
};

export async function createPayment(payload: CreatePaymentPayload) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { enrollmentId, userId, userName, amount } = await payload;

    if (!enrollmentId || !userId || !userName || !amount) {
      throw new Error("Missing required fields");
    }

    const payment = await db.payments.create({
      data: {
        enrollmentId,
        userId,
        userName,
        amount,
        schoolId: currentUser.schoolId,
      },
    });
    revalidatePath("/payments");
    revalidatePath(`/payments/${enrollmentId}`);

    return payment;
  } catch (error) {
    return { error };
  }
}
