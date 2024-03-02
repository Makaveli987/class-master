"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { formatPhoneNumber } from "@/lib/utils";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Link from "next/link";

import { MerakiBadge } from "@/components/ui/meraki-badge";
import { format } from "date-fns";
import Image from "next/image";
import { DeleteTeacherButton } from "./delete-course-button";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 relative rounded-full flex justify-center items-center bg-muted">
          <Image
            src="/teacher.png"
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
    cell: ({ row }) => <span>{formatPhoneNumber(row.original.phone)}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="pl-2 text-xs"
        title="Date of Birth"
      />
    ),
    cell: ({ row }) => {
      const dateOfBirth = format(row.original.dateOfBirth, "dd-MMM-yyyy");
      return <span>{dateOfBirth}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const created = format(row.original.createdAt, "dd-MMM-yyyy HH:mm");
      return <span>{created}</span>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Role"
      />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      const variant = role === "ADMIN" ? "purple" : "emerald";
      return <MerakiBadge variant={variant}>{role.toLowerCase()}</MerakiBadge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacherId = row.original.id;
      return (
        <div className="flex justify-end gap-2">
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/teachers/${teacherId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <DeleteTeacherButton teacherId={teacherId} buttonType="icon" />
        </div>
      );
    },
  },
];
