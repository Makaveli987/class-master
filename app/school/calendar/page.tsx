import { getClassroomsOptions } from "@/actions/get-classrooms";
import Calendar from "./_components/full-calendar";
import { DropdownSelectOptions } from "@/components/ui/dropdown-select";
import { getTeachersOptions } from "@/actions/get-teachers";

export default async function CalendarPage() {
  const classrooms = (await getClassroomsOptions()) as DropdownSelectOptions[];
  const teachers = (await getTeachersOptions()) as DropdownSelectOptions[];

  return (
    <div className="max-w-screen-2xl">
      <Calendar classrooms={classrooms} teachers={teachers} />
    </div>
  );
}
