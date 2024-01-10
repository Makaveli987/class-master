import { getCourses } from "@/actions/get-courses";
import { getEnrollment } from "@/actions/get-enrolments";
import EnrollForm, {
  EnrollFormCourse,
} from "@/components/enrolled-courses/enroll-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip2 } from "@/components/ui/tooltip2";
import { EnrollUserType } from "@/hooks/useEnrollDialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { EnrollmentData } from "@/lib/models/enrollment-data";
import { PlusCircleIcon, XIcon } from "lucide-react";
import React from "react";
import Notes from "../_components/notes";

export default async function EnrollmentId({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = (await getEnrollment(
    params.enrollmentId
  )) as EnrollmentData;

  const courses = (await getCourses()) as EnrollFormCourse[];

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollment</h3>
      <div className="grid grid-cols-5 gap-6">
        <Card className="col-span-2">
          <CardHeader className="mb-3">
            <CardTitle>Enrollment</CardTitle>
            <CardDescription>
              This is how others will see this enrollment on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollForm
              userId={
                enrollment.groupId ? enrollment.groupId : enrollment.studentId
              }
              userType={
                enrollment.groupId
                  ? EnrollUserType.GROUP
                  : EnrollUserType.STUDENT
              }
              // @ts-ignore
              enrollData={enrollment}
              courses={courses || []}
              action={DialogAction.EDIT}
            />
          </CardContent>
        </Card>

        <Notes notes={data} />
      </div>

      <Card className="mt-6">
        <CardContent>
          <CardHeader className="mb-3">
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              All classes for this course enrollment
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}

const data = [
  {
    id: "test",
    date: "12.01.2024",
    teacher: "Natasa Blagojevic",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repudiandae cumque sunt eligendi adipisci, minus",
  },
  {
    id: "test2",
    date: "12.01.2024",
    teacher: "Natasa Blagojevic",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repudiandae cumque sunt eligendi adipisci, minus",
  },
  {
    id: "test3",
    date: "12.01.2024",
    teacher: "Natasa Blagojevic",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repudiandae cumque sunt eligendi adipisci, minus",
  },
  {
    id: "test4",
    date: "12.01.2024",
    teacher: "Natasa Blagojevic",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repudiandae cumque sunt eligendi adipisci, minus",
  },
  {
    id: "test5",
    date: "12.01.2024",
    teacher: "Natasa Blagojevic",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repudiandae cumque sunt eligendi adipisci, minus",
  },
];
