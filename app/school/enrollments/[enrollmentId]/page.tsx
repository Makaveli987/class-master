import { getCourses } from "@/actions/get-courses";
import { getEnrollment } from "@/actions/get-enrolments";
import { getNotes } from "@/actions/get-notes";
import EnrollForm, {
  EnrollFormCourse,
} from "@/components/enrolled-courses/enroll-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { NoteData } from "@/hooks/use-note-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { EnrollmentData } from "@/lib/models/enrollment-data";
import Notes from "../_components/notes";
import StatsCard from "@/components/cards/stats-card";
import { BarChart2Icon, PlusCircleIcon, UserIcon, Users } from "lucide-react";
import CourseProgress from "@/components/course-progress";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getExams } from "@/actions/get-exams";
import StudentExams from "../_components/student-exams";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import EnrollmentDetails from "../_components/enrollment-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function EnrollmentId({
  params,
}: {
  params: { enrollmentId: string };
}) {
  const enrollment = (await getEnrollment(
    params.enrollmentId
  )) as EnrollmentData;

  const courses = (await getCourses()) as EnrollFormCourse[];
  const notes = (await getNotes(params.enrollmentId)) as NoteData[];
  const exams = await getExams(enrollment.id, enrollment.studentId || "");

  function getEnrollentUser() {
    return enrollment.studentId
      ? `${enrollment.student?.firstName} ${enrollment.student?.lastName}`
      : `${enrollment.group?.name}`;
  }

  function getEnrollentUserType() {
    return enrollment.studentId ? "Student" : "Group";
  }

  function getEnrollentUserIcon() {
    return enrollment.studentId ? (
      <UserIcon className="h-5 w-5 text-muted-foreground" />
    ) : (
      <Users className="h-5 w-5 text-muted-foreground" />
    );
  }

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollment</h3>
      <Card>
        <CardHeader>
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image
                src="/male-student.png"
                alt={"test"}
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {enrollment.student?.firstName +
                  " " +
                  enrollment.student?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Enrolled: {formatDate(enrollment.student?.createdAt!, false)}
              </p>
            </div>

            <div className="ml-auto">
              {/* <DeleteStudentButton
                studentId={params.enrollmentId}
                buttonType="button"
              /> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />

          <EnrollmentDetails enrollment={enrollment} />

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
                <StudentExams
                  exams={exams}
                  enrollmentId={enrollment.id}
                  studentId={enrollment.studentId}
                />
              </TabsContent>
              <TabsContent value="classes">Classes</TabsContent>
            </Tabs>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
