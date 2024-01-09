"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import CourseDialog from "./course-dialog";

interface CoursesTableProps {
  courses: Course[];
}

export default function CoursesTable({ courses }: CoursesTableProps) {
  const router = useRouter();
  return (
    <DataTable
      onRowClick={(rowData) => {
        router.push(`courses/${rowData.id}`);
      }}
      columns={columns}
      data={courses || []}
      filterPlaceholder="Search courses..."
    >
      <CourseDialog />
    </DataTable>
  );
}
