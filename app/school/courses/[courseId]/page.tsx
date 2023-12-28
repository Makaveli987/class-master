import { getCourse } from "@/actions/get-courses";
import React from "react";
import CourseForm from "../_components/course-form";
import { getCourseStats } from "@/actions/get-enrolments";
import CourseStatsCard from "../_components/course-stats-card";
import {
  DollarSignIcon,
  GraduationCap,
  PlusCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip2 } from "@/components/ui/tooltip2";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourse(params.courseId);
  const courseStats = await getCourseStats(params.courseId);

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Courses</h3>
      <div className="mb-6 flex gap-6">
        <CourseStatsCard
          title="Total Enrollments"
          amount={courseStats?.totalEnrollments}
          icon={<DollarSignIcon className="h-5 w-5 text-muted-foreground" />}
        />
        <CourseStatsCard
          title="Active Enrollments"
          amount={courseStats?.activeEnrollments}
          icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        />
        <CourseStatsCard
          title="Teachers"
          amount={courseStats?.totalTeachers}
          icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        />
      </div>
      <div className="flex gap-6">
        <div className="bg-white border rounded-xl p-7 shadow-sm flex-1">
          <h3 className="text-lg font-medium">Course Info</h3>
          <CourseForm data={course} action="edit" />
        </div>

        <Card className="flex-1 overflow-auto">
          <CardHeader className="mb-3">
            <div className="flex">
              <div>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>
                  Teachers assigned to this course
                </CardDescription>
              </div>
              <Button className="ml-10" variant="ghost">
                <PlusCircleIcon className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
              <div className="flex items-center justify-between hover:bg-muted rounded-xl p-2 max-w-[330px] group">
                <div className="flex items-center ">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                </div>
                <Tooltip2 text="Unassign teacher">
                  <Button className="hidden group-hover:block" variant="ghost">
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Tooltip2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    // </div>
  );
}
