import { getCourses } from "@/actions/get-courses";
import { EnrollmentResponse, getEnrollment } from "@/actions/get-enrolments";
import { getNotes } from "@/actions/get-notes";

import { getEnrollemntExams } from "@/actions/get-exams";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { NoteData } from "@/hooks/use-note-dialog";
import { format } from "date-fns";
import Image from "next/image";
import { DeleteEnrollmentButton } from "../_components/delete-enrollment-button";
import EnrollmentDetails from "../_components/enrollment-details";
import Notes from "../_components/notes";
import StudentExams from "../_components/student-exams";
import Exams from "@/components/exams/exams";

export default async function EnrollmentId({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = (await getEnrollment(
    params.enrollmentId
  )) as EnrollmentResponse;

  const userId = enrollment.studentId
    ? enrollment.studentId
    : enrollment.groupId || "";

  const courses = await getCourses();
  const notes = (await getNotes(params.enrollmentId, userId)) as NoteData[];
  const exams = await getEnrollemntExams(
    enrollment.id,
    enrollment.studentId || ""
  );

  function getEnrollentUser() {
    return enrollment.studentId
      ? `${enrollment.student?.firstName} ${enrollment.student?.lastName}`
      : `${enrollment.group?.name}`;
  }

  function getEnrollentUserType() {
    return enrollment.studentId ? "Student" : "Group";
  }

  function getEnrollentUserIcon() {
    return enrollment.studentId ? "male-student" : "group";
  }

  function getEnrollentDate() {
    return enrollment.studentId
      ? enrollment.student?.createdAt
      : enrollment.group?.createdAt;
  }

  return (
    <div className="max-w-[900px] m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollment</h3>
      <Card>
        <CardHeader>
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image
                src={`/${getEnrollentUserIcon()}.png`}
                alt={"test"}
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {getEnrollentUser()}
              </h2>
              <p className="text-muted-foreground text-sm">
                Enrolled: {format(getEnrollentDate()!, "dd-MMM-yyyy")}
              </p>
            </div>

            <div className="ml-auto">
              <DeleteEnrollmentButton buttonType="button" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />

          <EnrollmentDetails enrollment={enrollment} courses={courses || []} />

          <Card className="mt-4">
            <Tabs defaultValue="notes">
              <TabsList className="grid grid-cols-12 rounded-b-none">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <Notes
                  userType={
                    enrollment.groupId
                      ? EnrollUserType.GROUP
                      : EnrollUserType.STUDENT
                  }
                  notes={notes}
                  enrollmentId={params.enrollmentId}
                  userId={
                    enrollment.studentId
                      ? enrollment.studentId
                      : enrollment.groupId
                  }
                />
              </TabsContent>
              <TabsContent value="tests">
                <Exams
                  exams={exams}
                  enrollmentId={enrollment.id}
                  studentId={enrollment.studentId}
                />
                {/* <StudentExams
                  exams={exams}
                  enrollmentId={enrollment.id}
                  studentId={enrollment.studentId}
                /> */}
              </TabsContent>
              <TabsContent value="classes">Classes</TabsContent>
            </Tabs>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
