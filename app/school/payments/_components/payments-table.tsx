"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { EnrollmentData } from "@/lib/models/enrollment-data";
import { useRouter } from "next/navigation";
import { getEnrollmentColumns } from "./columns";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";

interface EnrollmentTableProps {
  enrollments: EnrollmentData[];
  userType: EnrollUserType;
}

export default function PaymentsTable({
  enrollments,
  userType,
}: EnrollmentTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`payments/${rowData.id}`);
      }}
      columns={getEnrollmentColumns(userType)}
      data={enrollments || []}
      filterPlaceholder={`Search ${
        userType === EnrollUserType.STUDENT ? "students" : "groups"
      }...`}
    ></DataTable>
  );
}
