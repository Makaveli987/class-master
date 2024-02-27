"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteCourseButton } from "./delete-course-button";
import { format } from "date-fns";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 relative rounded-full flex justify-center items-center bg-muted">
          <Image src="/course.png" alt="course" fill className="rounded-full" />
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="pl-2 text-xs max-w-48"
        column={column}
        title="Description"
      />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <Tooltip2 text={row.original.description}>
          <div className="truncate max-w-64">{row.original.description}</div>
        </Tooltip2>
      );
    },
  },
  {
    accessorKey: "defaultPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Default Price" />
    ),
  },
  {
    accessorKey: "defaultTotalClasses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Classes" />
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
          <DeleteCourseButton courseId={courseId} buttonType="icon" />
        </div>
      );
    },
  },
];
