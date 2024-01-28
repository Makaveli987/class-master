"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { User } from "@prisma/client";
import { columns } from "./columns";

import { useRouter } from "next/navigation";
import TeacherDialog from "../../../../components/dialogs/teacher-dialog/teacher-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import useTeacherDialog from "@/hooks/use-teacher-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";

interface TeachersTableProps {
  teachers: User[];
}

export default function TeachersTable({ teachers }: TeachersTableProps) {
  const router = useRouter();
  const teacherDialog = useTeacherDialog();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`teachers/${rowData.id}`);
      }}
      columns={columns}
      data={teachers || []}
      filterPlaceholder="Search teachers..."
    >
      <Button
        onClick={() => teacherDialog.open({ action: DialogAction.CREATE })}
      >
        <PlusCircleIcon className="w-4 h-4 mr-2" />
        Add Teacher
      </Button>
    </DataTable>
  );
}
