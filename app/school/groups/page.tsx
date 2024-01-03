import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getGroups } from "@/actions/get-groups";
import { columns } from "./_components/columns";
import GroupDialog from "./_components/group-dialog";
import { getStudents } from "@/actions/get-students";

export default async function GroupsPage() {
  const data = await getGroups();
  const students = await getStudents();

  return (
    <>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Groups</h3>
      <Card className="pt-6">
        <CardContent>
          <DataTable
            columns={columns}
            data={data || []}
            filterPlaceholder="Search groups..."
          >
            <GroupDialog students={students} />
          </DataTable>
        </CardContent>
      </Card>
    </>
  );
}
