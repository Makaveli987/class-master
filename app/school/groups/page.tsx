import { getGroups } from "@/actions/get-groups";
import { getStudents } from "@/actions/get-students";
import { Card, CardContent } from "@/components/ui/card";
import GroupsTable from "./_components/groups-table";

export default async function GroupsPage() {
  const groups = await getGroups();
  const students = await getStudents();

  return (
    <>
      <h3 className="pb-4 font-medium tracking-tight text-xl">Groups</h3>
      <Card className="pt-6">
        <CardContent>
          <GroupsTable groups={groups || []} students={students || []} />
        </CardContent>
      </Card>
    </>
  );
}
