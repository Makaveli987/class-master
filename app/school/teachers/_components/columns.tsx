"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { cn, formatDate } from "@/lib/utils";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { RoleType } from "@/lib/models/role";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  teacherId: string;
}

const DeleteButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, teacherId, asChild = false, ...props }, ref) => {
    const router = useRouter();

    function onDelete() {
      axios
        .delete(`/api/auth/register/teachers/${teacherId}`)
        .then(() => {
          toast.success("Teacher has been archived");
          router.refresh();
        })
        .catch(() =>
          toast.error("Something bad happend. Teacher has not been archived!")
        );
    }

    return (
      <ConfirmDialog
        description="This action will archive the teacher. You will not be able to assign this teacher to courses and students."
        onConfirm={onDelete}
      >
        <div>
          <Tooltip2 text="delete" side="top">
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

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Role"
      />
    ),
    cell: ({ row }) => {
      // @ts-ignore
      const role = row.original.role;
      return (
        <Badge
          variant="default"
          className={cn(
            role === RoleType.ADMIN
              ? "bg-violet-500 hover:bg-violet-500"
              : "bg-emerald-500 hover:bg-emerald-500"
          )}
        >
          {role === RoleType.ADMIN ? "Admin" : "Teacher"}
        </Badge>
      );
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
          <DeleteButton teacherId={teacherId} />
        </div>
      );
    },
  },
];
