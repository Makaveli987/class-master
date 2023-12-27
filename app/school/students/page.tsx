import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./_components/columns";
import StudentDialog from "./_components/student-dialog";
import { getStudents } from "@/actions/get-students";

export default async function StudentsPage() {
  const data = await getStudents();

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Students</h3>
      <div className="bg-white w-full rounded-md border p-5">
        <DataTable
          columns={columns}
          data={data || []}
          filterPlaceholder="Search students..."
        >
          <StudentDialog />
        </DataTable>
      </div>
    </div>
  );
}
