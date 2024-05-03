import { getEnrollmentOptionsByAttendeeId } from "@/actions/enrollments/get-enrollment-options-by-attendee-id";
import { getGroupsOptionsByTeacherId } from "@/actions/groups/get-groups-options-by-teacher-id";
import { getStudentsOptionsByTeacherId } from "@/actions/students/get-students-options-by-teacher-id";
import { ComboboxOptions } from "@/components/ui/combobox";
import { ClassType } from "@/lib/models/class-type";
import { useState } from "react";
import { toast } from "sonner";
import { EnrollUserType } from "./use-enroll-dialog";

export function useClassDialogForm() {
  const [isFetching, setIsFetching] = useState(false);

  const [attendeeOptions, setAttendeeOptions] = useState<ComboboxOptions[]>([]);
  const [coursesOptions, setCoursesOptions] = useState<ComboboxOptions[]>([]);

  const typeOptions = [
    {
      value: ClassType.STUDENT,
      label: "Individual",
    },
    { value: ClassType.GROUP, label: "Group" },
  ];

  async function getStudentOptions(teacherId: string) {
    setIsFetching(true);
    const response = await getStudentsOptionsByTeacherId(teacherId);

    if (response.error) {
      toast.error(response.error);
    } else {
      setAttendeeOptions(response.data);
    }
    setIsFetching(false);
  }

  async function getGroupOptions(teacherId: string) {
    setIsFetching(true);
    const response = await getGroupsOptionsByTeacherId(teacherId);

    if (response.error) {
      toast.error(response.error);
    } else {
      setAttendeeOptions(response.data);
    }
    setIsFetching(false);
  }

  function getAtendeeOptions(
    teacherId: string,
    userType: EnrollUserType | string
  ) {
    userType === EnrollUserType.STUDENT
      ? getStudentOptions(teacherId)
      : getGroupOptions(teacherId);
  }

  async function getEnrollmentsOptions(
    attendeeId: string,
    userType: EnrollUserType | string
  ) {
    setIsFetching(true);
    const response = await getEnrollmentOptionsByAttendeeId(
      attendeeId,
      userType
    );

    if (response.error) {
      toast.error(response.error);
    } else {
      setCoursesOptions(response.data);
    }
    setIsFetching(false);
  }

  return {
    isFetching,
    typeOptions,
    getAtendeeOptions,
    getEnrollmentsOptions,
    attendeeOptions,
    coursesOptions,
  };
}
