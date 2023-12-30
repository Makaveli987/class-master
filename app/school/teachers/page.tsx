import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import React from "react";
import TeacherDialog from "./_components/teacher-dialog";
import { getTeachers } from "@/actions/get-teachers";
import { columns } from "./_components/columns";

export default async function TeacherPage() {
  const teachers = await getTeachers();

  console.log("teachers :>> ", teachers);

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Teachers</h3>
      <Card className="pt-6">
        <CardContent>
          <DataTable
            columns={columns || []}
            data={teachers || []}
            filterPlaceholder="Search teachers..."
          >
            <TeacherDialog />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
