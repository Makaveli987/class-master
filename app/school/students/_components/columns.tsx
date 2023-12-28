"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { BookPlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import React from "react";
import useEnrollDialog from "../_hooks/useEnrollDialog";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const EnrollButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const enrollDialog = useEnrollDialog();
    return (
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 group "
        onClick={enrollDialog.open}
      >
        <BookPlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
      </Button>
    );
  }
);

EnrollButton.displayName = "EnrollButton";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const payment = row.original;

      return <span>{payment.email}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Phone"
      />
    ),
    enableSorting: false,
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
      const studentId = row.original.id;
      return (
        <div className="flex justify-end gap-2">
          {/* <EnrollStudentDialog> */}
          <Tooltip2 text="Add to course" side="top">
            <EnrollButton />
          </Tooltip2>
          {/* </EnrollStudentDialog> */}
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/students/${studentId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <Tooltip2 text="Delete" side="top">
            <Button variant="ghost" className="h-8 w-8 p-0 group">
              <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
            </Button>
          </Tooltip2>
        </div>
      );
    },
  },
];
