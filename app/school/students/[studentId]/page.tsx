import { getStudent } from "@/actions/get-students";
import { getCourses } from "@/actions/get-courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentCourses from "../_components/student-courses";
import StudentForm from "../_components/student-form";
import { getEnrollmentsByStudentId } from "@/actions/get-enrolments";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import EnrollDialog from "@/components/enrolled-courses/enroll-dialog";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { EnrollFormCourse } from "@/components/enrolled-courses/enroll-form";

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
        <CardContent className="mt-6">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <CardHeader className="pl-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is how others will see student on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-3xl">
                <StudentForm data={student} action={DialogAction.EDIT} />
              </CardContent>
            </TabsContent>

            <TabsContent value="courses">
              <CardHeader className="pl-2">
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Courses that student has attended
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-4xl">
                <StudentCourses
                  enrollments={enrollments || []}
                  studentId={params.studentId}
                />

                <div className="flex justify-end">
                  <EnrollDialog
                    courses={courses || []}
                    userId={params.studentId}
                    userType={EnrollUserType.STUDENT}
                  >
                    <Button className="mt-12 ml-auto">
                      <PlusCircleIcon className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </EnrollDialog>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="classes">
              <CardHeader className="pl-2">
                <CardTitle>Classes</CardTitle>
                <CardDescription>
                  Classes that student has attended
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <DataTable
                  columns={[]}
                  data={[]}
                  filterPlaceholder="Search classes..."
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
