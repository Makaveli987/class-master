import { EnrollmentResponse } from "@/actions/get-enrolments";
import { Payments } from "@prisma/client";

export function getPaidSum(payments: Payments[]) {
  let paid = 0;
  if (payments) {
    payments.forEach((p) => (paid += p.amount));
  }

  return paid;
}

export function getTotalPrice(enrollment: EnrollmentResponse) {
  if (enrollment?.groupId && !enrollment?.group?.isCompanyGroup) {
    return (
      enrollment?.pricePerStudent! * enrollment.group?.students?.length! || 1
    );
  }
  return enrollment?.price || 0;
}

export function getPendingSum(
  payments: Payments[],
  enrollment: EnrollmentResponse
) {
  const pendingSum = getTotalPrice(enrollment) - getPaidSum(payments);
  return pendingSum < 0 ? 0 : pendingSum;
}
