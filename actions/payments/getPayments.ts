import { db } from "@/lib/db";
import { Payments } from "@prisma/client";
import getCurrentUser from "../get-current-user";

export const getPaymentsByEnrollmentId = async (enrollmentId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { data: [], error: "Unauthorized" };
    }

    const payments = await db.payments.findMany({
      where: {
        enrollmentId,
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: payments as unknown as Payments[] };
  } catch (error) {
    console.error("[ENROLLMENTS] Error fetching student enrollments");
    return null;
  }
};
