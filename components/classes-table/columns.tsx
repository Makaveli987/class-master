"use client";

import { ExamResponse } from "@/actions/get-exams";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-colimn-header";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { useExamDialog } from "@/hooks/use-exam-dialog";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { SchoolClassResponse } from "@/actions/get-classes";
import { getTimeFromDate } from "@/lib/utils";
import { Badge, BadgeProps, badgeVariants } from "../ui/badge";
import { useClassDetailsDialog } from "@/hooks/use-class-details-dialog";
import { useClassDialog } from "@/hooks/use-class-dialog";

export function GetSchoolClassColumns(
  excludeCourseCol: boolean
): ColumnDef<SchoolClassResponse>[] {
  const classDetailsDialog = useClassDetailsDialog();
  const router = useRouter();

  function onDelete(examId: string) {
    axios
      .delete(`/api/classes/${examId}`)
      .then(() => {
        toast.success("Class has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Class has not been archived!")
      );
  }

  const columns: ColumnDef<SchoolClassResponse>[] = [
    {
      accessorKey: "start",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const start = row.original.start;
        const end = row.original.end;

        return (
          <div className="flex gap-4 text-sm">
            <span>{format(start, "dd-MMM-yyyy")}</span>
            <span>
              {getTimeFromDate(start)}-{getTimeFromDate(end)}
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
        let variant;
        switch (row.original.schoolClassStatus) {
          case "SCHEDULED":
            variant = "info";
            break;

          case "HELD":
            variant = "success";
            break;

          case "CANCELED":
            variant = "destructive";
            break;

          default:
            break;
        }
        return (
          // @ts-ignore
          <Badge variant={variant}>{row.original.schoolClassStatus}</Badge>
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
            {/* <DeleteExamButton examId={examId} buttonType="icon" /> */}
            <ConfirmDialog
              description="This action will delete the class. You will not be able to retrieve it."
              onConfirm={() => onDelete(examId)}
            >
              <div>
                <Tooltip2 text="Delete" side="top">
                  <Button variant="ghost" className="h-8 w-8 p-0 group">
                    <Trash2Icon className="w-4 h-4 text-muted-foreground group-hover:text-rose-600" />
                  </Button>
                </Tooltip2>
              </div>
            </ConfirmDialog>
          </div>
        );
      },
    },
  ];

  return columns;
}
