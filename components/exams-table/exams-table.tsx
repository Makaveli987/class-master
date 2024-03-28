"use client";
import { useExamDialog } from "@/hooks/use-exam-dialog";
import { DataTable } from "../ui/data-table/data-table";
import { GetExamColumns } from "./columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlusCircleIcon } from "lucide-react";

import { ExamResponse } from "@/actions/get-exams";
import { Button } from "../ui/button";

interface ExamsProps {
  exams: ExamResponse | null;
  enrollmentId: string;
  studentId?: string | null;
  groupId?: string;
}

export default function ExamsTable({
  exams,
  enrollmentId,
  studentId,
  groupId,
}: ExamsProps) {
  const examDialog = useExamDialog();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Exams</CardTitle>
        <CardDescription>All the exams student has taken</CardDescription>
      </CardHeader>
      <CardContent className="max-w-4xl ">
        <DataTable
          className="border-0"
          headerClassName="rounded-t-md bg-muted/50"
          columns={GetExamColumns({
            isEnrolmentExam: true,
            isGroupExam: !!groupId,
          })}
          data={exams?.data || []}
          filterPlaceholder="Search exams..."
        >
          <Button
            className="ml-auto"
            onClick={() => {
              examDialog.open({ enrollmentId, studentId, groupId });
            }}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Exam
          </Button>
        </DataTable>
      </CardContent>
    </Card>
  );
}
