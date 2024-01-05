"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Student } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import StudentDialog from "./student-dialog";
import { useRouter } from "next/navigation";

interface StudentsTableProps {
  students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`students/${rowData.id}`);
      }}
      columns={columns}
      data={students || []}
      filterPlaceholder="Search students..."
    >
      <StudentDialog />
    </DataTable>
  );
}
