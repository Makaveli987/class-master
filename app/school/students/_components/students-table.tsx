"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Student } from "@prisma/client";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import StudentDialog from "./student-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import useStudentDialog from "@/hooks/use-student-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";

interface StudentsTableProps {
  students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const router = useRouter();
  const studentDialog = useStudentDialog();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`students/${rowData.id}`);
      }}
      columns={columns}
      data={students || []}
      filterPlaceholder="Search students..."
    >
      <Button
        onClick={() => studentDialog.open({ action: DialogAction.CREATE })}
      >
        <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Student
      </Button>
    </DataTable>
  );
}
