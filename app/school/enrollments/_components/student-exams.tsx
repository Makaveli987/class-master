"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExamDialog } from "@/hooks/useExamDialog";
import { Exam } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";

interface StudentExamsProps {
  exams: Exam[] | null;
  enrollmentId: string;
  studentId: string | null;
}

export default function StudentExams({
  exams,
  enrollmentId,
  studentId,
}: StudentExamsProps) {
  const examDialog = useExamDialog();
  return (
    <Card className="mt-6">
      <CardHeader className="mb-3 relative ">
        <CardTitle>Exams</CardTitle>
        <CardDescription>Exams for this course enrollment</CardDescription>
        <div className="absolute right-6 top-4">
          <Button
            onClick={() => {
              examDialog.open({ enrollmentId, studentId });
            }}
            variant="ghost"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Exam
          </Button>
        </div>
      </CardHeader>
      <CardContent>{!exams?.length && <p>There are no exams.</p>}</CardContent>
    </Card>
  );
}
