"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DataTable } from "../ui/data-table/data-table";
import { GetSchoolClassColumns } from "./columns";

import { SchoolClassResponse } from "@/actions/get-classes";

interface SchoolClassesProps {
  schoolClasses: SchoolClassResponse[] | null;
  excludeCourseCol?: boolean;
}

export default function SchoolClassesTable({
  schoolClasses,
  excludeCourseCol = false,
}: SchoolClassesProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Classes</CardTitle>
        <CardDescription>All the classes student has attended</CardDescription>
      </CardHeader>
      <CardContent className="max-w-screen-xl">
        <DataTable
          headerClassName="rounded-t-md bg-muted/50"
          columns={GetSchoolClassColumns(excludeCourseCol || false)}
          data={schoolClasses || []}
          filterPlaceholder="Search classes..."
        ></DataTable>
      </CardContent>
    </Card>
  );
}
