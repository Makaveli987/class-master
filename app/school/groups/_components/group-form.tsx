"use client";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useGroupDialog from "@/hooks/use-group-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { Loader2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GroupPayload {
  id?: string;
  name: string;
  studentIds: string[];
}

const formSchema = z.object({
  name: z.string().min(1, "Field is required").min(3, {
    message: "Name is too short",
  }),
});

export default function GroupForm() {
  const [pending, setPending] = useState(false);
  const [studentOptions, setStudentOptions] = useState<ComboboxOptions[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<ComboboxOptions[]>(
    []
  );

  const groupDialog = useGroupDialog();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: groupDialog?.data
      ? {
          name: groupDialog?.data?.name,
        }
      : { name: "" },
  });

  function setOptions() {
    const stdOptions = groupDialog.students?.map((student) => ({
      value: student.id,
      label: `${student.firstName} ${student.lastName}`,
    }));

    const assignedStudentsOptions = groupDialog?.data?.students?.map(
      (student) => ({
        value: student.id,
        label: `${student.firstName} ${student.lastName}`,
      })
    );

    console.log("assignedStudentsOptions", assignedStudentsOptions);

    const options = stdOptions?.filter(
      (studentOption) =>
        !assignedStudentsOptions?.some(
          (assignedStudent: ComboboxOptions) =>
            studentOption.value === assignedStudent.value
        )
    );

    setStudentOptions(options || []);
    setSelectedStudents(assignedStudentsOptions || []);
  }

  useEffect(() => {
    setOptions();
  }, []);

  function handleAddStudent(studentId: string) {
    const studentToBeAdded = studentOptions?.find(
      (element) => element.value === studentId
    );

    if (studentToBeAdded) {
      const updatedSelectedStudents = [...selectedStudents, studentToBeAdded];
      setSelectedStudents(updatedSelectedStudents);
    }
    const filteredStudentOptions = studentOptions?.filter(
      (option) => option.value !== studentId
    );

    setStudentOptions(filteredStudentOptions);
  }

  function handleRemoveStudent(studentId: string) {
    const studentToBeRemoved = selectedStudents?.find(
      (element) => element.value === studentId
    );

    if (studentToBeRemoved) {
      const updatedSelectedStudents = [...studentOptions, studentToBeRemoved];
      setStudentOptions(updatedSelectedStudents);
    }
    const filteredStudentOptions = selectedStudents?.filter(
      (option) => option.value !== studentId
    );

    setSelectedStudents(filteredStudentOptions);
  }

  function createGroup(data: GroupPayload) {
    axios
      .post("/api/groups", { ...data })
      .then((response: AxiosResponse<Group>) => {
        if (response.status === 201) {
          toast.success("Group has been created", {
            description: `${data.name}`,
          });
          form.reset();
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Group wasn't created!", {
          description: `${data.name}`,
        });
        console.error(error);
      })
      .finally(() => {
        setPending(false);
        groupDialog.close();
      });
  }

  function updateGroup(data: GroupPayload) {
    axios
      .patch("/api/groups/" + groupDialog?.data?.id, { ...data })
      .then((response: AxiosResponse<Group>) => {
        if (response.status === 200) {
          toast.success("Group has been updated", {
            description: `${data.name}`,
          });
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Group wasn't updated!", {
          description: `${data.name}`,
        });
        console.error(error);
      })
      .finally(() => {
        setPending(false);
        groupDialog.close();
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    const studentIds = selectedStudents.map((student) => student.value);
    const payload = {
      ...values,
      studentIds,
    };

    groupDialog.action === DialogAction.CREATE
      ? createGroup(payload)
      : updateGroup(payload);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input disabled={pending} placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="students">Students</Label>
          <Combobox
            placeholder="Select student..."
            disabled={pending}
            options={studentOptions || []}
            onChange={(value) => {
              console.log("value :>> ", value);
              handleAddStudent(value);
            }}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Assigned students</p>
          <Separator />
          {!selectedStudents.length ? (
            <p className="text-sm py-4 px-2">No students selected.</p>
          ) : (
            <ScrollArea className="max-h-[400px] py-4 px-1 ">
              <div className="flex flex-col">
                {selectedStudents.map((student, index) => (
                  <div
                    className="flex justify-between items-center hover:bg-muted transition-all rounded-lg p-1 group cursor-pointer"
                    key={student.value}
                    onClick={() =>
                      router.push(`/school/students/${student.value}`)
                    }
                  >
                    <p className="text-sm ml-2">
                      {index + 1}. {student.label}
                    </p>
                    <Button
                      disabled={pending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStudent(student.value);
                      }}
                      className="w-6 h-6 p-1"
                      variant="ghost"
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="flex pt-4 flex-col-reverse sm:flex-row sm:items-center sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
          <Button
            disabled={pending}
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              form.reset();

              groupDialog.close();
            }}
            variant="outline"
          >
            Close
          </Button>

          <Button disabled={pending || !form.formState.isDirty} type="submit">
            {pending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
