"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { EnrollmentData } from "@/lib/models/EnrollmentData";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

interface EnrollmentTableProps {
  enrollments: EnrollmentData[];
}

export default function EnrollmentTable({ enrollments }: EnrollmentTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`enrollments/${rowData.id}`);
      }}
      columns={columns}
      data={enrollments || []}
      filterPlaceholder="Search students..."
    ></DataTable>
  );
}
