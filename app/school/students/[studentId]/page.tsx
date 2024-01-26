import { getCourses } from "@/actions/get-courses";
import { getEnrollmentsByStudentId } from "@/actions/get-enrolments";
import { getStudent } from "@/actions/get-students";
import { EnrollFormCourse } from "@/components/enrolled-courses/enroll-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import StudentCourses from "../_components/student-courses";
import StudenDetails from "../_components/student-details-card";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);
  const courses = (await getCourses()) as EnrollFormCourse[];
  const enrollments = await getEnrollmentsByStudentId(params.studentId);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
      <Card>
        <CardHeader>
          <div className="flex gap-6">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image
                // src={`/${student?.gender.toLowerCase()}-student.png`}
                src={`/female-student.png`}
                alt={"test"}
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {student?.firstName + " " + student?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(student?.createdAt!, false)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />
          <StudenDetails student={student || undefined} />

          <Separator className="my-6" />

          <StudentCourses
            enrollments={enrollments || []}
            studentId={params.studentId}
            courses={courses || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
