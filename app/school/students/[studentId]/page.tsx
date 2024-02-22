import { CourseResponse, getCourses } from "@/actions/get-courses";
import { getEnrollmentsByStudentId } from "@/actions/get-enrolments";
import { getStudent, getStudentGroups } from "@/actions/get-students";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import StudentCourses from "../_components/student-courses";
import StudentDetails from "../_components/student-details-card";
import { DeleteStudentButton } from "../_components/delete-student-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamsTable from "@/components/exams-table/exams-table";
import { getStudentExams } from "@/actions/get-exams";
import SchoolClassesTable from "@/components/classes-table/classes-table";
import { getClassesByStudentId } from "@/actions/get-classes";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);
  const courses = (await getCourses()) as CourseResponse[];
  const enrollments = await getEnrollmentsByStudentId(params.studentId);
  const exams = await getStudentExams(params.studentId);
  const schoolClasses = await getClassesByStudentId(params.studentId);
  const studentGroups = await getStudentGroups(params.studentId);

  return (
    <div className="max-w-[900px] m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
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
                {student?.firstName + " " + student?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(student?.createdAt!, false)}
              </p>
            </div>
            <div className="ml-auto">
              <DeleteStudentButton
                studentId={params.studentId}
                buttonType="button"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />
          <StudentDetails
            student={student || undefined}
            studentGroups={studentGroups || undefined}
          />

          {/* <StudentCourses
            enrollments={enrollments || []}
            studentId={params.studentId}
            courses={courses || []}
          /> */}

          {/* <Card className="mt-4 overflow-auto w-full"> */}
          <div className="overflow-auto border rounded-lg mt-4">
            <Tabs
              defaultValue="enrolledCourses"
              className="w-full overflow-auto flex flex-col"
            >
              <TabsList className="rounded-b-none justify-start flex-1 min-w-min">
                <TabsTrigger
                  className="min-w-min sm:min-w-20"
                  value="enrolledCourses"
                >
                  Enrolled Courses
                </TabsTrigger>
                <TabsTrigger className="min-w-min sm:min-w-20" value="tests">
                  Tests
                </TabsTrigger>
                <TabsTrigger className="min-w-min sm:min-w-20" value="classes">
                  Classes
                </TabsTrigger>
                <TabsTrigger className="min-w-min sm:min-w-20" value="reports">
                  Reports
                </TabsTrigger>
              </TabsList>
              <TabsContent value="enrolledCourses">
                <StudentCourses
                  enrollments={enrollments || []}
                  studentId={params.studentId}
                  courses={courses || []}
                />
              </TabsContent>
              <TabsContent value="tests">
                <ExamsTable
                  exams={exams}
                  enrollmentId={""}
                  studentId={params.studentId}
                />
              </TabsContent>
              <TabsContent value="classes">
                <SchoolClassesTable schoolClasses={schoolClasses} />
              </TabsContent>
              <TabsContent value="reports">reports</TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
