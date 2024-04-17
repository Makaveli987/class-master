import { getEnrollment } from "@/actions/get-enrolments";
import { notFound } from "next/navigation";
import React from "react";
import EnrollmentDetails from "../_components/enrollment-details";
import { formatPrice } from "@/lib/utils";
import {
  BanknoteIcon,
  CoinsIcon,
  DollarSignIcon,
  PlusCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EnrollmentPayments({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = await getEnrollment(params.enrollmentId);

  if (!enrollment) {
    return notFound();
  }

  function getPaidSum() {
    let paid = 0;
    if (enrollment?.payments) {
      enrollment.payments.forEach((p) => (paid += p.amount));
    }

    return paid;
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
                  {formatPrice(enrollment.price)}
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
                  +{formatPrice(getPaidSum())}
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
                  -{formatPrice(enrollment.price - getPaidSum())}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-10 pb-6 px-2 mb-3 flex flex-row max-w-5xl">
            <div className="space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">
                Payment History
              </h3>
              <p className="text-sm text-muted-foreground">
                All payments for this enrollment
              </p>
            </div>
            <Button
              className="ml-auto"
              //   onClick={() =>
              //     noteDialog.open({
              //       enrollmentId,
              //       userId: userId || "",
              //       userType,
              //     })
              //   }
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              New Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
