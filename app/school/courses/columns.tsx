"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2Icon } from "lucide-react";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Description"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "pricePerClass",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Price Per Class"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "totalClasses",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs"
        column={column}
        title="Total Classes"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" className="h-8 w-8 p-0 group ">
            <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 group">
            <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
          </Button>
        </div>
      );
    },
  },
];
