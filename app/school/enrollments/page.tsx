import {
  getGroupsEnrollments,
  getStudentsEnrollments,
} from "@/actions/get-enrolments";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentTable from "./_components/enrollment-table";
import { EnrollmentData } from "@/lib/models/EnrollmentData";
// import TeachersTable from "./_components/teachers-table";

export default async function EnrollmentsPage() {
  const studentsEnrollments =
    (await getStudentsEnrollments()) as EnrollmentData[];
  const groupsEnrollments = (await getGroupsEnrollments()) as EnrollmentData[];

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Enrollments</h3>
      <Card className="pt-6">
        <CardContent>
          {/* <TeachersTable teachers={teachers || []} /> */}
          <Tabs defaultValue="students">
            <TabsList className="mb-3">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <EnrollmentTable enrollments={studentsEnrollments || []} />
            </TabsContent>

            <TabsContent value="groups">
              <EnrollmentTable enrollments={studentsEnrollments || []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
