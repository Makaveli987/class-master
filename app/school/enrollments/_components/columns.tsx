"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Progress } from "@/components/ui/progress";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { EnrollmentData } from "@/lib/models/enrollment-data";
import { calcPercentage, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { DeleteEnrollmentButton } from "./delete-enrollment-button";

export function getEnrollmentColumns(
  userType: EnrollUserType
): ColumnDef<EnrollmentData>[] {
  const userAccessorName =
    userType === EnrollUserType.STUDENT ? "student.firstName" : "group.name";

  const columns: ColumnDef<EnrollmentData>[] = [
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
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Attended Classes" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-[220px]">
            {row.original.attendedClasses === row.original.totalClasses ? (
              <Badge className="bg-green-600 hover:bg-green-600">
                Completed
              </Badge>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-right font-semibold leading-none">
                  {row.original.attendedClasses}/{row.original.attendedClasses}
                </p>
                <Progress
                  value={calcPercentage(
                    row.original.attendedClasses,
                    row.original.totalClasses
                  )}
                />
              </div>
            )}
          </div>
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
            <DeleteEnrollmentButton buttonType="icon" />
          </div>
        );
      },
    },
  ];

  return columns;
}
