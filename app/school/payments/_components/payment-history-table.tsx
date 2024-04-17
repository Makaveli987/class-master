"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { EnrollmentData } from "@/lib/models/enrollment-data";
import { useRouter } from "next/navigation";
import { getEnrollmentColumns } from "./columns";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { Payments } from "@prisma/client";

interface EnrollmentTableProps {
  payments: Payments[];
}

export default function PaymentsHistoryTable({
  payments,
}: EnrollmentTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`payments/${rowData.id}`);
      }}
      columns={paymentHistoryColumns}
      data={payments || []}
      filterPlaceholder={"Search payments..."}
    ></DataTable>
  );
}
