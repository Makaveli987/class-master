"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import { EnrollmentResponse } from "@/actions/get-enrolments";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { useRouter } from "next/navigation";
import { getEnrollmentColumns } from "./columns";

interface EnrollmentTableProps {
  enrollments: EnrollmentResponse[];
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
