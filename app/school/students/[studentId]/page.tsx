import React from "react";
import { getStudent } from "@/actions/get-students";
import { Separator } from "@/components/ui/separator";
import StudentForm from "../_components/student-form";
import StudentCourses from "../_components/student-courses";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import EnrollStudentDialog from "../_components/enroll-dialog";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Students</h3>
      <div className="bg-white border rounded-md p-4">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="p-4 max-w-3xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    This is how others will see student on the site.
                  </p>
                </div>
                <Separator />

                <StudentForm data={student} action="edit" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="courses">
            <div className="bg-white max-w-3xl p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Courses</h3>
                  <p className="text-sm text-muted-foreground">
                    Courses the student attended
                  </p>
                </div>
                <Separator />

                <StudentCourses studentId={params.studentId} />
              </div>
              <div className="flex justify-end">
                <EnrollStudentDialog>
                  <Button className="mt-14 ml-auto">
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </EnrollStudentDialog>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <div className="space-y-6 p-4">
              <div>
                <h3 className="text-lg font-medium">Classes</h3>
                <p className="text-sm text-muted-foreground">
                  Classes the student attended
                </p>
              </div>
              <Separator />

              <DataTable
                columns={[]}
                data={[]}
                filterPlaceholder="Search classes..."
              />
              {/* <StudentCourses courses={[]} /> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
