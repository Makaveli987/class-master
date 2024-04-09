import { getCourses } from "@/actions/get-courses";
import { getEnrollmentsByGroupId } from "@/actions/get-enrolments";
import { getGroup } from "@/actions/get-groups";
import { getStudents } from "@/actions/get-students";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import { DeleteGroupButton } from "../_components/delete-group-button";
import GroupCourses from "../_components/group-courses";
import GroupDetails from "../_components/group-details";

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const group = await getGroup(params.groupId);
  const students = await getStudents();
  const courses = await getCourses();
  const enrollments = await getEnrollmentsByGroupId(params.groupId);

  return (
    <div className="max-w-[900px] m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Groups</h3>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative rounded-full flex justify-center items-center bg-muted">
              <Image src={`/group.png`} alt={"test"} height={55} width={55} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold tracking-tight">
                {group?.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Created: {format(group?.createdAt as Date, "dd-MMM-yyyy")}
              </p>
            </div>
            <div className="ml-auto">
              <DeleteGroupButton
                className="ml-auto"
                groupId={group?.id}
                buttonType="button"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-1" />
          <GroupDetails group={group || undefined} students={students || []} />

          <GroupCourses
            enrollments={enrollments || []}
            groupId={params.groupId}
            courses={courses || []}
            isGroupActive={group?.active}
            isCompanyGroup={group?.isCompanyGroup}
          />
        </CardContent>
      </Card>
    </div>
  );
}
