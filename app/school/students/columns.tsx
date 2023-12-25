"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <span className="font-semibold text-slate-600">{payment.email}</span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit2Icon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit2Icon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit2Icon className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
