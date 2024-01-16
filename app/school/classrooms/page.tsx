import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Classrooms from "./_components/classrooms";
import { getClassrooms } from "@/actions/get-classrooms";

export default async function ClassroomsPage() {
  const classrooms = await getClassrooms();

  return (
    <div className="max-w-screen-2xl">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Classrooms</h3>
      <Card className="max-w-xl">
        <CardHeader className="mb-3">
          <CardTitle>School classrooms</CardTitle>
          <CardDescription>List of classrooms at your school</CardDescription>
        </CardHeader>
        <CardContent>
          <Classrooms classrooms={classrooms} />
        </CardContent>
      </Card>
    </div>
  );
}
