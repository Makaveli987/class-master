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
      <div className="mb-6 flex gap-6">
        <StatsCard title={getEnrollentUserType()} icon={getEnrollentUserIcon()}>
          <div className="text-xl font-bold">{getEnrollentUser()}</div>
          <span className="text-sm text-muted-foreground">
            Enrolled: {formatDate(enrollment.createdAt, false)}
          </span>
        </StatsCard>
        <StatsCard
          title="Progress"
          icon={<BarChart2Icon className="h-5 w-5 text-muted-foreground" />}
        >
          <CourseProgress
            attendedClasses={enrollment.attendedClasses}
            totalClasses={40}
            className="mt-4"
          />
        </StatsCard>
      </div>
      <div className="grid grid-cols-6 gap-6">
        <Card className="col-span-3">
          <CardHeader className="mb-3">
            <CardTitle>Enrollment</CardTitle>
            <CardDescription>
              This is how others will see this enrollment on the site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollForm />
          </CardContent>
        </Card>

        <Notes
          userType={
            enrollment.groupId ? EnrollUserType.GROUP : EnrollUserType.STUDENT
          }
          notes={notes}
          enrollmentId={params.enrollmentId}
          userId={
            enrollment.studentId ? enrollment.studentId : enrollment.groupId
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="mt-6">
          <CardHeader className="mb-3">
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              All classes for this course enrollment
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <StudentExams
          exams={exams}
          enrollmentId={enrollment.id}
          studentId={enrollment.studentId}
        />
      </div>
    </div>
  );
}
