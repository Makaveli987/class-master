"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import useCourseDialog from "@/hooks/use-course-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { Course } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

interface CoursesTableProps {
  courses: Course[];
}

export default function CoursesTable({ courses }: CoursesTableProps) {
  const router = useRouter();
  const courseDialog = useCourseDialog();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`courses/${rowData.id}`);
      }}
      columns={columns}
      data={courses || []}
      filterPlaceholder="Search courses..."
    >
      <Button
        onClick={() => courseDialog.open({ action: DialogAction.CREATE })}
      >
        <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Course
      </Button>
    </DataTable>
  );
}
