"use client";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Course } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
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
