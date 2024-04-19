"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import getCurrentUser from "../get-current-user";

export async function updatePayment(paymentId: string, amount: number) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!paymentId || !amount) {
      throw new Error("Missing required fields");
    }

    const payment = await db.payments.update({
      where: { id: paymentId },
      data: {
        amount,
      },
    });
    revalidatePath("/payments");
    revalidatePath(`/payments/${payment.enrollmentId}`);

    return payment;
  } catch (error) {
    return { error };
  }
}
