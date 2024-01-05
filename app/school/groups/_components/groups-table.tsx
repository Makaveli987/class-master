"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Group, Student } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import GroupDialog from "./group-dialog";

interface GroupsTableProps {
  groups: Group[];
  students: Student[];
}

export default function CoursesTable({ groups, students }: GroupsTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`groups/${rowData.id}`);
      }}
      columns={columns}
      data={groups || []}
      filterPlaceholder="Search groups..."
    >
      <GroupDialog students={students} />
    </DataTable>
  );
}
