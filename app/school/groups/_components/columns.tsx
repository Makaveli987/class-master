"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { formatDate } from "@/lib/utils";
import { Course, Group } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  courseId: string;
}

const DeleteButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, courseId, asChild = false, ...props }, ref) => {
    function onDelete() {
      axios
        .delete(`/api/courses/${courseId}`)
        .then(() => toast.success("Course has been archived"))
        .catch(() =>
          toast.error("Something bad happend. Course has not been archived!")
        );
    }

    return (
      <ConfirmDialog
        description="This action will archive the course. You will not be able to assign students and teachers to this course."
        onConfirm={onDelete}
      >
        <div>
          <Tooltip2 text="Delete" side="top">
            <Button variant="ghost" className="h-8 w-8 p-0 group ">
              <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
            </Button>
          </Tooltip2>
        </div>
      </ConfirmDialog>
    );
  }
);
DeleteButton.displayName = "DeleteButton";

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
      // @ts-ignore
      <span className="font-medium">{row.original.students.length}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const created = formatDate(row.original.createdAt);

      return <span>{created}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const updated = formatDate(row.original.updatedAt);

      return <span>{updated}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const courseId = row.original.id;

      return (
        <div className="flex justify-end gap-2">
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/courses/${courseId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <DeleteButton courseId="courseId" />
        </div>
      );
    },
  },
];
