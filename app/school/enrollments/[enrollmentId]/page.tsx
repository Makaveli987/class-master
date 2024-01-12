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
import { EnrollUserType } from "@/hooks/useEnrollDialog";
import { NoteData } from "@/hooks/useNoteDialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { EnrollmentData } from "@/lib/models/enrollment-data";
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
  const notes = (await getNotes(params.enrollmentId)) as NoteData[];

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

        <Notes notes={notes} enrollmentId={params.enrollmentId} />
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
