import {
  getGroupsEnrollments,
  getStudentsEnrollments,
} from "@/actions/get-enrolments";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { EnrollmentData } from "@/lib/models/enrollment-data";
import EnrollmentTable from "./_components/enrollment-table";
import { UserIcon, UsersIcon } from "lucide-react";

export default async function EnrollmentsPage() {
  const studentsEnrollments =
    (await getStudentsEnrollments()) as EnrollmentData[];
  const groupsEnrollments = (await getGroupsEnrollments()) as EnrollmentData[];

  return (
    <div className="max-w-screen-2xl m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollments</h3>
      <Card className="pt-6">
        <CardContent>
          <Tabs defaultValue="students">
            <TabsList className="mb-3">
              <TabsTrigger className="min-w-28" value="students">
                <UserIcon className="w-4 h-4 mr-1" />
                Students
              </TabsTrigger>
              <TabsTrigger className="min-w-28" value="groups">
                <UsersIcon className="w-4 h-4 mr-1" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <EnrollmentTable
                userType={EnrollUserType.STUDENT}
                enrollments={studentsEnrollments || []}
              />
            </TabsContent>

            <TabsContent value="groups">
              <EnrollmentTable
                userType={EnrollUserType.GROUP}
                enrollments={groupsEnrollments || []}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
