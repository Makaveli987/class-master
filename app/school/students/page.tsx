import { getStudents } from "@/actions/get-students";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StudentsTable from "./_components/students-table";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="max-w-screen-2xl m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Students</h3>
      <Card className="pt-6">
        <CardContent>
          <StudentsTable students={students || []} />
        </CardContent>
      </Card>

      {/* <div className="grid grid-cols-8 gap-6 mt-6">
        <Card className="h-[800px] col-span-3 pt-6">
          <CardContent>
            <StudentsTable students={students || []} />
          </CardContent>
        </Card>
        <Card className="h-[800px] col-span-5">
          <div className="rounded-t-lg bg-primary/40">
            <CardHeader>
              <div className="flex items-center gap-10">
                <div className=" h-20 w-20 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 text-2xl">
                  DV
                </div>
                <p className="text-muted-foreground">Student Details</p>
              </div>
            </CardHeader>
          </div>
          <CardContent className="mt-6">
            Select student to see details.
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
