import { getClassroomsOptions } from "@/actions/get-classrooms";
import { getTeachersOptions } from "@/actions/get-teachers";
import { DropdownSelectOptions } from "@/components/ui/dropdown-select";
import ClassCalendar from "./_components/class-calendar";
import { getClasses } from "@/actions/get-classes";

export default async function CalendarPage() {
  const classrooms = (await getClassroomsOptions()) as DropdownSelectOptions[];
  const teachers = (await getTeachersOptions()) as DropdownSelectOptions[];
  const schoolClasses = await getClasses();

  return (
    <div className="max-w-screen-2xl">
      <ClassCalendar
        classrooms={classrooms || []}
        teachers={teachers || []}
        classes={schoolClasses || []}
      />
    </div>
  );
}
