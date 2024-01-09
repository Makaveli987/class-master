"use client";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { formatDate } from "@/lib/utils";
import { Student } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  studentId: string;
}

// const EnrollButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, studentId, asChild = false, ...props }, ref) => {
//     return (
//       <EnrollStudentDialog studentId={studentId}>
//         <div>
//           <Tooltip2 text="Add to course" side="top">
//             <Button variant="ghost" className="h-8 w-8 p-0 group ">
//               <BookPlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
//             </Button>
//           </Tooltip2>
//         </div>
//       </EnrollStudentDialog>
//     );
//   }
// );
// EnrollButton.displayName = "EnrollButton";

const DeleteButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, studentId, asChild = false, ...props }, ref) => {
    const router = useRouter();
    function onDelete() {
      axios
        .delete(`/api/students/${studentId}`)
        .then(() => {
          toast.success("Student has been archived");
          router.refresh();
        })
        .catch(() =>
          toast.error("Something bad happend. Student has not been archived!")
        );
    }

    return (
      <ConfirmDialog
        description="This action will archive the student. You will not be able to schedule classes or assign course for this student."
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
          <Tooltip2 text="Edit" side="top">
            <Link href={`/school/students/${studentId}`}>
              <Button variant="ghost" className="h-8 w-8 p-0 group ">
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Link>
          </Tooltip2>
          <DeleteButton studentId={studentId} />
        </div>
      );
    },
  },
];
