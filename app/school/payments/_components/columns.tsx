"use client";

import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseProgress from "@/components/course-progress";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { MerakiBadge } from "@/components/ui/meraki-badge";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { getPaidSum, getPendingSum, getTotalPrice } from "@/lib/payment-utils";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircleIcon, EditIcon } from "lucide-react";
import Link from "next/link";

export function getEnrollmentColumns(
  userType: EnrollUserType
): ColumnDef<EnrollmentResponse>[] {
  const userAccessorName =
    userType === EnrollUserType.STUDENT ? "student.firstName" : "group.name";

  const columns: ColumnDef<EnrollmentResponse>[] = [
    {
      accessorKey: userAccessorName,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={userType === EnrollUserType.STUDENT ? "Student" : "Group"}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {userType === EnrollUserType.STUDENT
            ? `${row.original.student?.firstName} ${row.original.student?.lastName}`
            : row.original.group?.name}
        </span>
      ),
    },
    {
      accessorKey: "course.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const enrollment = row.original;

        return <span>{enrollment.course?.name}</span>;
      },
    },
    {
      accessorKey: "teacher.firstName",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="pl-2 text-xs"
          column={column}
          title="Teacher"
        />
      ),
      cell: ({ row }) => (
        <span className="">
          {row.original.teacher?.firstName} {row.original.teacher?.lastName}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        return (
          <span className="font-semibold">
            {formatPrice(getTotalPrice(row.original))}
          </span>
        );
      },
    },
    {
      accessorKey: "payments.paid",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs ml-2"
          column={column}
          title="Paid"
        />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <span className="text-emerald-500 font-semibold">
            {formatPrice(getPaidSum(row.original.payments || []))}
          </span>
        );
      },
    },
    {
      accessorKey: "payments.pending",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs ml-2"
          column={column}
          title="Pending"
        />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <span className="text-rose-500 font-semibold">
            {formatPrice(
              getPendingSum(row.original.payments || [], row.original)
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="text-xs ml-2"
          column={column}
          title="Attended Classes"
        />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return row.original?.completed ? (
          <div className="max-w-[180px] flex justify-center">
            <MerakiBadge variant={"emerald"}>
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Completed
            </MerakiBadge>
          </div>
        ) : (
          <div className="max-w-[220px]">
            <CourseProgress
              attendedClasses={row.original?.attendedClasses || 0}
              totalClasses={row.original?.totalClasses || 0}
              labelPosition="right"
              completed={row.original?.completed}
            />
          </div>
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
              <Link href={`/school/payments/${enrollmentId}`}>
                <Button variant="ghost" className="h-8 w-8 p-0 group ">
                  <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                </Button>
              </Link>
            </Tooltip2>
          </div>
        );
      },
    },
  ];

  return columns;
}
