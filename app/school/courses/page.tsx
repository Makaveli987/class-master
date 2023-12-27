import { getCourses } from "@/actions/get-courses";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";

export default async function Courses() {
  const data = await getCourses();

  return (
    <div>
      <h3 className="pb-4 font-semibold tracking-tight text-xl">Courses</h3>
      <div className="bg-white w-full rounded-md border p-5">
        <DataTable
          columns={columns}
          data={data || []}
          filterPlaceholder="Search students..."
        >
          {/* <StudentDialog /> */}
        </DataTable>
      </div>
    </div>
  );
}
