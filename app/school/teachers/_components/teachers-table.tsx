"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { User } from "@prisma/client";
import React from "react";
import { columns } from "./columns";

import { useRouter } from "next/navigation";
import TeacherDialog from "./teacher-dialog";

interface TeachersTableProps {
  teachers: User[];
}

export default function StudentsTable({ teachers }: TeachersTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`teachers/${rowData.id}`);
      }}
      columns={columns}
      data={teachers || []}
      filterPlaceholder="Search teachers..."
    >
      <TeacherDialog />
    </DataTable>
  );
}
