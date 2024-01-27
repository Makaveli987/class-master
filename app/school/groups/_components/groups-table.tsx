"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import useGroupDialog from "@/hooks/use-group-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { Student } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { GroupResponse } from "@/actions/get-groups";

interface GroupsTableProps {
  groups: GroupResponse[];
  students: Student[];
}

export default function CoursesTable({ groups, students }: GroupsTableProps) {
  const groupDialog = useGroupDialog();
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
      <Button
        onClick={() =>
          groupDialog.open({ action: DialogAction.CREATE, students })
        }
      >
        <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Group
      </Button>
    </DataTable>
  );
}
