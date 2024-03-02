import { getClassesByStudentId } from "@/actions/get-classes";
import { CourseResponse, getCourses } from "@/actions/get-courses";
import {
  getEnrollmentsByStudentId,
  getGroupEnrollmentsByStudentId,
} from "@/actions/get-enrolments";
import { getStudentExams } from "@/actions/get-exams";
import { getStudent, getStudentGroups } from "@/actions/get-students";
import SchoolClassesTable from "@/components/classes-table/classes-table";
import ExamsTable from "@/components/exams-table/exams-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  BookAIcon,
  CalendarCheckIcon,
  FileIcon,
  FileImageIcon,
} from "lucide-react";
import Image from "next/image";
import { DeleteStudentButton } from "../_components/delete-student-button";
import StudentCourses from "../_components/student-courses";
import StudentDetails from "../_components/student-details-card";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);
  const courses = (await getCourses()) as CourseResponse[];
  const enrollments = await getEnrollmentsByStudentId(params.studentId);
  const groupEnrollments = await getGroupEnrollmentsByStudentId(
    params.studentId
  );
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
                Created: {format(student?.createdAt as Date, "dd-MMM-yyyy")}
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
              <TabsList className="rounded-b-none justify-start flex-1">
                <TabsTrigger className="min-w-28 px-4" value="enrolledCourses">
                  <BookAIcon className="w-4 h-4 mr-1" />
                  Enrolled Courses
                </TabsTrigger>
                <TabsTrigger className="min-w-28 px-4 " value="tests">
                  <FileIcon className="w-4 h-4 mr-1" />
                  Tests
                </TabsTrigger>
                <TabsTrigger className="min-w-28 px-4" value="classes">
                  <CalendarCheckIcon className="w-4 h-4 mr-1" />
                  Classes
                </TabsTrigger>
                <TabsTrigger className="min-w-28 px-4" value="reports">
                  <FileImageIcon className="w-4 h-4 mr-1" />
                  Reports
                </TabsTrigger>
              </TabsList>
              <TabsContent value="enrolledCourses">
                <StudentCourses
                  enrollments={enrollments || []}
                  groupEnrollments={groupEnrollments || []}
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
