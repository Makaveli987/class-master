"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { Payments } from "@prisma/client";
import { GetPaymentHistoryColumns } from "./payment-history-columns";

interface EnrollmentTableProps {
  payments: Payments[];
  shouldShowStudents: boolean;
}

export default function PaymentsHistoryTable({
  payments,
  shouldShowStudents,
}: EnrollmentTableProps) {
  return (
    <DataTable
      headerClassName="rounded-t-md bg-muted/50"
      columns={GetPaymentHistoryColumns(shouldShowStudents)}
      data={payments || []}
      filterPlaceholder={"Search payments..."}
    ></DataTable>
  );
}
