"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { usePaymentDialog } from "@/hooks/use-payment-dialog";
import { formatPrice } from "@/lib/utils";
import { Payments } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon } from "lucide-react";

export function GetPaymentHistoryColumns(
  shouldShowStudents: boolean
): ColumnDef<Payments>[] {
  const paymentDialog = usePaymentDialog();

  const columns: ColumnDef<Payments>[] = [
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
        const created = format(
          row.original.updatedAt as Date,
          "dd-MMM-yyyy HH:mm"
        );

        return <span>{created}</span>;
      },
    },
    {
      accessorKey: "userName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return <span className="font-semibold">{row.original.userName}</span>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return (
          <span className="font-semibold text-emerald-600">
            +{formatPrice(row.original.amount)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const enrollmentId = row.original.id;
        return (
          <div className="flex justify-end gap-2">
            <Tooltip2 text="Edit" side="top">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 group "
                onClick={() => {
                  paymentDialog.open({
                    enrollmentId,
                    userId: row.original.userId,
                    userName: row.original.userName,
                    shouldShowStudents,
                  });
                }}
              >
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Tooltip2>
          </div>
        );
      },
    },
  ];

  return columns;
}
