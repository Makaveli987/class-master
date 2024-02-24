"use client";
import { CourseResponse } from "@/actions/get-courses";
import { EnrollmentResponse } from "@/actions/get-enrolments";
import CourseEnrollment from "@/components/course-enrollment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useEnrollDialog, { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { PlusCircleIcon } from "lucide-react";

interface GroupCoursesProps {
  groupId: string;
  enrollments: EnrollmentResponse[];
  courses: CourseResponse[];
}

export default function GroupCourses({
  groupId,
  enrollments,
  courses,
}: GroupCoursesProps) {
  const enrollDialog = useEnrollDialog();

  if (!enrollments) {
    return <p className="text-sm">The group has not attended any courses.</p>;
  }
  return (
    <Card>
      <div className="max-w-4xl">
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Courses that group has attended</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {enrollments.map((enrollment) => (
              <CourseEnrollment
                key={enrollment.id}
                enrollment={enrollment}
                userType={EnrollUserType.GROUP}
                courses={courses}
              />
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() =>
                enrollDialog.open({
                  userId: groupId,
                  userType: EnrollUserType.GROUP,
                  courses,
                  action: DialogAction.CREATE,
                })
              }
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" /> Enroll Course
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
