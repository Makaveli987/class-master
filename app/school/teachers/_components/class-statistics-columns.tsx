"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { ColumnDef } from "@tanstack/react-table";
import { TrendingUpIcon } from "lucide-react";

import { TotalClassesByTeacher } from "@/actions/classes/get-class-statistics-by-teacher";
import { Tooltip2 } from "@/components/ui/tooltip2";

export const classStatisticsColumns: ColumnDef<TotalClassesByTeacher>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="mr-auto"
        column={column}
        title="Month"
      />
    ),
    cell: ({ row }) => {
      const date = row.original.date;

      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "classes",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-xs text-right pr-14"
        column={column}
        title="Total Classes"
      />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const totalClasses = row.original.classes;

      return (
        <div className="flex justify-end items-center gap-14">
          <span className="font-semibold">{totalClasses}</span>
          <Tooltip2 text="Full Statistics" side="top">
            <Button variant="ghost" className="h-8 w-8 p-0 group ">
              <TrendingUpIcon className="w-4 h-4 text-muted-foreground group-hover:text-red-600" />
            </Button>
          </Tooltip2>
        </div>
      );
    },
  },
];
