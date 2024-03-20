"use client";

import { SchoolClassResponse } from "@/actions/get-classes";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { getTimeFromDate } from "@/lib/utils";
import { ClassStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { addMinutes, format } from "date-fns";
import {
  CalendarCheckIcon,
  CheckCircle2Icon,
  EditIcon,
  XCircleIcon,
} from "lucide-react";
import { MerakiBadge } from "../ui/meraki-badge";

export function GetSchoolClassColumns(
  excludeCourseCol: boolean
): ColumnDef<SchoolClassResponse>[] {
  const classDetailsDialog = useClassDetailsDialog();

  function getClassVariant(
    classStatus: ClassStatus
  ): "blue" | "rose" | "emerald" {
    if (classStatus === ClassStatus.SCHEDULED) return "blue";
    if (classStatus === ClassStatus.CANCELED) return "rose";
    if (classStatus === ClassStatus.HELD) return "emerald";
    return "blue";
  }

  function getClassIcon(classStatus: ClassStatus): React.ReactNode {
    if (classStatus === ClassStatus.SCHEDULED)
      return <CalendarCheckIcon className="w-3 h-3 mr-1" />;
    if (classStatus === ClassStatus.CANCELED)
      return <XCircleIcon className="w-3 h-3 mr-1" />;
    if (classStatus === ClassStatus.HELD)
      return <CheckCircle2Icon className="w-3 h-3 mr-1" />;
    return <CalendarCheckIcon className="w-3 h-3 mr-1" />;
  }

  const columns: ColumnDef<SchoolClassResponse>[] = [
    {
      accessorKey: "start",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const start = row.original.start;
        const end = row.original.end;

        return (
          <div className="flex gap-4 text-sm">
            <span>{format(start, "dd-MMM-yyyy")}</span>
            <span>
              {getTimeFromDate(start)}-{getTimeFromDate(addMinutes(end, 1))}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "enrollment.course.name",
      header: ({ column }) =>
        excludeCourseCol ? null : (
          <DataTableColumnHeader column={column} title="Course" />
        ),
      cell: ({ row }) => {
        const enrollmentCourse = row.original.enrollment?.course;

        return excludeCourseCol ? null : <span>{enrollmentCourse?.name}</span>;
      },
    },
    {
      accessorKey: "teacher.firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
      cell: ({ row }) => {
        const teacher = row.original.teacher;

        return <span>{teacher?.firstName + " " + teacher.lastName}</span>;
      },
    },
    {
      accessorKey: "schoolClassStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.schoolClassStatus;
        const variant = getClassVariant(status);

        return (
          <MerakiBadge variant={variant} className="border-0">
            <div className="flex items-center">
              {getClassIcon(status)} {status.toLowerCase()}
            </div>
          </MerakiBadge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const examId = row.original.id;
        return (
          <div className="flex justify-end gap-2">
            <Tooltip2 text="Edit" side="top">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 group"
                onClick={() => {
                  classDetailsDialog.open(row.original);
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
