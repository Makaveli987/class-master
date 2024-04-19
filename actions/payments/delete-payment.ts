"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import getCurrentUser from "../get-current-user";

export async function deletePayment(paymentId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!paymentId) {
      throw new Error("Missing paymentId");
    }

    const payment = await db.payments.delete({
      where: { id: paymentId },
    });
    revalidatePath("/payments");
    revalidatePath(`/payments/${payment.enrollmentId}`);

    return "success";
  } catch (error) {
    return { error };
  }
}
