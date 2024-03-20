import { getCourses } from "@/actions/get-courses";
import { EnrollmentResponse, getEnrollment } from "@/actions/get-enrolments";
import { getNotes } from "@/actions/get-notes";

import { getAttendance } from "@/actions/attendance/get-attendance";
import { getClassesByEnrollmentId } from "@/actions/get-classes";
import { getEnrollemntExams } from "@/actions/get-exams";
import SchoolClassesTable from "@/components/classes-table/classes-table";
import ExamsTable from "@/components/exams-table/exams-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { NoteData } from "@/hooks/use-note-dialog";
import { format } from "date-fns";
import {
  CalendarCheckIcon,
  FileIcon,
  MessageSquareTextIcon,
  UserCheckIcon,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
// import AttendanceTable from "../_components/_attendance/attendance-table2";
import { DeleteEnrollmentButton } from "../_components/delete-enrollment-button";
import EnrollmentDetails from "../_components/enrollment-details";
import Notes from "../_components/notes";
import AttendanceTable from "../_components/attendance-table";

export default async function EnrollmentId({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = (await getEnrollment(
    params.enrollmentId
  )) as EnrollmentResponse;

  if (!enrollment) {
    return notFound();
  }

  const userId = enrollment.studentId
    ? enrollment.studentId
    : enrollment.groupId || "";

  const courses = await getCourses();
  const notes = (await getNotes(params.enrollmentId, userId)) as NoteData[];
  const exams = await getEnrollemntExams(enrollment.id);
  const attendance = await getAttendance(params.enrollmentId);

  const schoolClasses = await getClassesByEnrollmentId(params.enrollmentId);

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

            <div className="ml-auto flex gap-3">
              <DeleteEnrollmentButton
                enrollmentId={enrollment.id}
                buttonType="button"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />

          <EnrollmentDetails enrollment={enrollment} courses={courses || []} />

          <Card className="mt-4">
            <Tabs
              defaultValue="notes"
              className="w-full overflow-auto flex flex-col"
            >
              <TabsList className="justify-start flex-1 min-w-min rounded-b-none">
                <TabsTrigger className="min-w-28" value="notes">
                  <MessageSquareTextIcon className="w-4 h-4 mr-1" /> Notes
                </TabsTrigger>

                {enrollment.groupId && (
                  <TabsTrigger className="min-w-28" value="attendance">
                    <UserCheckIcon className="w-4 h-4 mr-1" />
                    Attendance
                  </TabsTrigger>
                )}
                <TabsTrigger className="min-w-28" value="tests">
                  <FileIcon className="w-4 h-4 mr-1" />
                  Tests
                </TabsTrigger>
                <TabsTrigger className="min-w-28" value="classes">
                  <CalendarCheckIcon className="w-4 h-4 mr-1" />
                  Classes
                </TabsTrigger>
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
              {enrollment.groupId && (
                <TabsContent value="attendance">
                  <AttendanceTable
                    attendance={attendance}
                    enrollmentId={enrollment.id}
                  />
                </TabsContent>
              )}
              <TabsContent value="tests">
                <ExamsTable
                  exams={exams}
                  enrollmentId={enrollment.id}
                  studentId={enrollment.studentId}
                  groupId={enrollment.groupId || undefined}
                />
              </TabsContent>
              <TabsContent value="classes">
                <SchoolClassesTable
                  schoolClasses={schoolClasses || []}
                  excludeCourseCol
                />
              </TabsContent>
            </Tabs>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
