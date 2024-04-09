"use client";

import { ExamResponse, Exams } from "@/actions/get-exams";
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

interface ExamColumnsPops {
  isEnrolmentExam?: boolean;
  isGroupExam?: boolean;
}

export function GetExamColumns(props: ExamColumnsPops): ColumnDef<Exams>[] {
  const examDialog = useExamDialog();
  const router = useRouter();

  function onDelete(examId: string) {
    axios
      .delete(`/api/exams/${examId}`)
      .then(() => {
        toast.success("Exam has been archived");
        router.refresh();
      })
      .catch(() =>
        toast.error("Something bad happend. Exam has not been archived!")
      );
  }

  const columns: ColumnDef<Exams>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const created = row.original.createdAt;

        return <span>{format(created, "dd-MMM-yyyy")}</span>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Exam" />
      ),
      cell: ({ row }) => {
        return <span className="font-semibold">{row.original.name}</span>;
      },
    },
    {
      accessorKey: "enrollment.course.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Course" />
      ),
      cell: ({ row }) => {
        const enrollmentCourse = row.original.enrollment?.course;
        return <span>{enrollmentCourse?.name}</span>;
      },
    },
    {
      accessorKey: "result",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Result" />
      ),
      cell: ({ row }) => {
        return <span className="font-semibold">{row.original.result}</span>;
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
                onClick={() =>
                  examDialog.open({
                    exam: row.original,
                    enrollmentId: row.original.enrollmentId,
                    studentId: row.original.studentId,
                  })
                }
              >
                <EditIcon className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
              </Button>
            </Tooltip2>
            {/* <DeleteExamButton examId={examId} buttonType="icon" /> */}
            <ConfirmDialog
              description="This action will archive the enrollment. You will not be able to assign students and classes to this enrollment."
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

  if (props.isGroupExam) {
    columns.splice(2, 0, {
      accessorKey: "student.firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.student?.firstName +
              " " +
              row.original.student?.lastName}
          </span>
        );
      },
    });
  }

  return columns;
}
