"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { Student } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import React from "react";
import { DeleteStudentButton } from "./delete-student-button";
import { formatPhoneNumber } from "@/lib/utils";
import { format } from "date-fns";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  studentId: string;
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 relative rounded-full flex justify-center items-center bg-muted">
          <Image
            src="/male-student.png"
            alt="student"
            fill
            className="rounded-full"
          />
        </div>
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const student = row.original;

      return <span>{student.email}</span>;
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
    cell: ({ row }) => {
      const student = row.original;

      return <span>{formatPhoneNumber(student.phone)}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Created"
      />
    ),
    cell: ({ row }) => {
      const created = format(row.original.createdAt, "dd-MMM-yyyy HH:mm");

      return <span>{created}</span>;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const studentId = row.original.id;
      return (
        <div className="flex justify-end gap-2">
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/students/${studentId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <DeleteStudentButton studentId={studentId} buttonType="icon" />
        </div>
      );
    },
  },
];
