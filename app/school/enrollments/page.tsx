import {
  getGroupsEnrollments,
  getStudentsEnrollments,
} from "@/actions/get-enrolments";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import TeachersTable from "./_components/teachers-table";

export default async function EnrollmentsPage() {
  const studentsEnrollments = await getStudentsEnrollments();
  const groupsEnrollments = await getGroupsEnrollments();

  return (
    <div>
      <h3 className="pb-4 font-medium tracking-tight text-xl">
        Enrollments {studentsEnrollments[0].id}
      </h3>
      <Card className="pt-6">
        <CardContent>
          {/* <TeachersTable teachers={teachers || []} /> */}
          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="students"></TabsContent>

            <TabsContent value="groups"></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
