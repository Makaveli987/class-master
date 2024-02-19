"use client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { useExamDialog } from "@/hooks/use-exam-dialog";
import { formatDate } from "@/lib/utils";
import { Exam } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  function handleConfirm(examId: string) {
    axios
      .delete("/api/exams/" + examId)
      .then((response: AxiosResponse<Exam>) => {
        if (response.status === 200) {
          router.refresh();
          toast.success("Exam successfully deleted.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Note wasn't deleted!");
      })
      .finally(() => {
        examDialog.close();
      });
  }

  return (
    <>
      <CardHeader className="mb-3 max-w-4xl flex flex-row">
        <div className="space-y-1.5">
          <CardTitle>Exams</CardTitle>
          <CardDescription>Exams for this course enrollment</CardDescription>
        </div>
        <Button
          className="ml-auto"
          onClick={() => {
            examDialog.open({ enrollmentId, studentId });
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Exam
        </Button>
      </CardHeader>
      <CardContent className="max-w-4xl">
        {!exams?.length && <p>There are no exams.</p>}

        {!!exams?.length && (
          <>
            <div className="grid grid-cols-6 gap-6 mb-1 px-4 text-muted-foreground text-sm">
              <p className="col-span-1 ">Date</p>
              <p className="col-span-3">Name</p>
              <p className="col-span-1 pl-1">Result</p>
            </div>
            <Separator />
          </>
        )}
        {exams?.map((exam) => (
          <div
            className="grid grid-cols-6 gap-6 hover:bg-muted rounded-md cursor-pointer group"
            key={exam.id}
          >
            <div
              className="col-span-5 grid grid-cols-5 justify-start gap-6 pl-2 py-2"
              onClick={() => examDialog.open({ exam })}
            >
              <p className="text-sm text-muted-foreground font-medium col-span-1">
                {formatDate(exam.createdAt, false)}
              </p>

              <p className="text-sm font-medium col-span-3">{exam.name}</p>
              <p className="text-sm font-medium whitespace-pre-wrap col-span-1">
                {exam.result}
              </p>
              {/* <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {exam.comment}
              </p> */}
            </div>
            <div className="col-span-1">
              <ConfirmDialog
                description={
                  "This action will remove this exam from this enrollment. You will not be able to revert it."
                }
                onConfirm={() => handleConfirm(exam.id)}
              >
                <div>
                  <Tooltip2 text="Delete Note">
                    <Button
                      className="hidden group-hover:block ml-auto"
                      variant="ghost"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </Tooltip2>
                </div>
              </ConfirmDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </>
  );
}
