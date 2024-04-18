"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { Payments } from "@prisma/client";
import { useRouter } from "next/navigation";
import { GetPaymentHistoryColumns } from "./payment-history-columns";

interface EnrollmentTableProps {
  payments: Payments[];
  shouldShowStudents: boolean;
}

export default function PaymentsHistoryTable({
  payments,
  shouldShowStudents,
}: EnrollmentTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`payments/${rowData.id}`);
      }}
      columns={GetPaymentHistoryColumns(shouldShowStudents)}
      data={payments || []}
      filterPlaceholder={"Search payments..."}
    ></DataTable>
  );
}
