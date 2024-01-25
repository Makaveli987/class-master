import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircleIcon } from "lucide-react";
import { getCourses } from "@/actions/get-courses";
import { getEnrollmentsByGroupId } from "@/actions/get-enrolments";
import { getGroup } from "@/actions/get-groups";
import { getStudents } from "@/actions/get-students";
import EnrollDialog from "@/components/enrolled-courses/enroll-dialog";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import StudentCourses from "../../students/_components/student-courses";
import GroupForm from "../_components/group-form";
import { EnrollFormCourse } from "@/components/enrolled-courses/enroll-form";

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const group = await getGroup(params.groupId);
  const students = await getStudents();
  const courses = (await getCourses()) as EnrollFormCourse[];
  const enrollments = await getEnrollmentsByGroupId(params.groupId);

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Groups</h3>
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
                  This is how others will see group on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-3xl">
                <GroupForm
                  group={group}
                  students={students}
                  action={DialogAction.EDIT}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="courses">
              <CardHeader className="pl-2">
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Courses that group has attended
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 max-w-3xl">
                <StudentCourses
                  studentId={params.groupId}
                  enrollments={enrollments || []}
                />

                <div className="flex justify-end">
                  <EnrollDialog
                    courses={courses || []}
                    userId={params.groupId}
                    userType={EnrollUserType.GROUP}
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
                  Classes that group has attended
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
