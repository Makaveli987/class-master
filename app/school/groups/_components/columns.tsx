"use client";

import { GroupResponse } from "@/actions/get-groups";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteGroupButton } from "./delete-group-button";
import StatusBadge from "@/components/ui/status-badge";

export const columns: ColumnDef<GroupResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 relative rounded-full flex justify-center items-center bg-muted">
          <Image src="/group.png" alt="group" fill className="rounded-full" />
        </div>
        <span className="font-medium">
          <span className="font-medium">{row.original.name}</span>
        </span>
      </div>
    ),
  },
  {
    accessorKey: "students",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Students"
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.students.length}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const created = format(
        row.original.createdAt as Date,
        "dd-MMM-yyyy HH:mm"
      );

      return <span>{created}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const updated = format(
        row.original.updatedAt as Date,
        "dd-MMM-yyyy HH:mm"
      );

      return <span>{updated}</span>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => {
      return <StatusBadge active={row.original.active} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const groupId = row.original.id;

      return (
        <div className="flex justify-end gap-2">
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/groups/${groupId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <DeleteGroupButton groupId={groupId} buttonType={"icon"} />
        </div>
      );
    },
  },
];
