import React from "react";
import { getStudent } from "@/actions/get-students";
import { Separator } from "@/components/ui/separator";
import StudentForm from "../_components/student-form";
import StudentCourses from "../_components/student-courses";
import { DataTable } from "@/components/ui/data-table/data-table";

export default async function StudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = await getStudent(params.studentId);

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Students</h3>
      <div className="">
        <div className="flex gap-6">
          <div className="bg-white w-full rounded-md border p-5">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-xs text-muted-foreground">
                  This is how others will see student on the site.
                </p>
              </div>
              <Separator />

              <StudentForm data={student} action="edit" />
            </div>
          </div>
          <div className="bg-white w-full rounded-md border p-5">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Courses</h3>
                <p className="text-xs text-muted-foreground">
                  Courses the student attended
                </p>
              </div>
              <Separator />

              <StudentCourses courses={[]} />
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white w-full rounded-md border p-5">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Classes</h3>
              <p className="text-xs text-muted-foreground">
                Classes the student attended
              </p>
            </div>
            <Separator />

            <DataTable
              columns={[]}
              data={[]}
              filterPlaceholder="Search classes"
            />
            {/* <StudentCourses courses={[]} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
