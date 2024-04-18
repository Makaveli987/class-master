import { getEnrollment } from "@/actions/get-enrolments";
import { getPaymentsByEnrollmentId } from "@/actions/payments/getPayments";
import { getPaidSum, getTotalPrice, getUnpaidSum } from "@/lib/payment-utils";
import { formatPrice } from "@/lib/utils";
import { BanknoteIcon, CoinsIcon, DollarSignIcon } from "lucide-react";
import { notFound } from "next/navigation";
import AddPaymentHeader from "../_components/add-payment-header";
import EnrollmentDetails from "../_components/enrollment-details";
import PaymentsHistoryTable from "../_components/payment-history-table";

export default async function EnrollmentPayments({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = await getEnrollment(params.enrollmentId);
  const payments = await getPaymentsByEnrollmentId(params.enrollmentId);

  if (!enrollment) {
    return notFound();
  }

  function shouldShowStudents() {
    if (enrollment?.groupId && !enrollment?.group?.isCompanyGroup) {
      return true;
    }
    return false;
  }

  return (
    <div className="max-w-screen-xl m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">
        Enrollment Payments
      </h3>
      <div className="w-full flex max-w-screen-xl mx-auto border rounded-md bg-card shadow-sm">
        <EnrollmentDetails enrollment={enrollment} />

        <div className="py-6 px-8 flex-1">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
              x-chunk="A card showing the total revenue in USD and the percentage difference from last month."
            >
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Price</h3>
                <DollarSignIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-semibold">
                  {formatPrice(getTotalPrice(enrollment))}
                </div>
              </div>
            </div>
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
              x-chunk="A card showing the total subscriptions and the percentage difference from last month."
            >
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Paid</h3>
                <BanknoteIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-semibold text-emerald-600">
                  {formatPrice(getPaidSum(payments?.data || []))}
                </div>
              </div>
            </div>
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
              x-chunk="A card showing the total sales and the percentage difference from last month."
            >
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Unpaid</h3>
                <CoinsIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-semibold text-rose-600">
                  {formatPrice(getUnpaidSum(payments?.data || [], enrollment))}
                </div>
              </div>
            </div>
          </div>

          <AddPaymentHeader
            enrollmentId={enrollment.id}
            userId={
              enrollment.studentId
                ? enrollment.schoolId
                : enrollment.groupId || ""
            }
            userName={
              enrollment.student
                ? enrollment.student?.fullName
                : enrollment.group?.name || ""
            }
            shouldShowStudents={shouldShowStudents()}
          />

          <PaymentsHistoryTable
            shouldShowStudents={shouldShowStudents()}
            payments={payments?.data || []}
          />
        </div>
      </div>
    </div>
  );
}
