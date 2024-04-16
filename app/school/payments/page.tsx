import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getGroupsEnrollments,
  getStudentsEnrollments,
} from "@/actions/get-enrolments";
import { EnrollUserType } from "@/hooks/use-enroll-dialog";
import { UserIcon, UsersIcon } from "lucide-react";
import PaymentsTable from "./_components/payments-table";

export default async function PaymentsPage() {
  const groupEnrollments = await getGroupsEnrollments();
  const studentEnrollments = await getStudentsEnrollments();

  return (
    <div className="max-w-screen-2xl m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Payments</h3>
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
              <PaymentsTable
                userType={EnrollUserType.STUDENT}
                enrollments={studentEnrollments || []}
              />
            </TabsContent>

            <TabsContent value="groups">
              <PaymentsTable
                userType={EnrollUserType.GROUP}
                enrollments={groupEnrollments || []}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
