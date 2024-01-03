"use client";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOptions } from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, Student } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GroupDialogProps {
  students: Student[] | null;
}

const formSchema = z.object({
  name: z.string().min(1, "Field is required").min(3, {
    message: "Name is too short",
  }),
});

export default function GroupDialog({ students }: GroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [studentOptions, setStudentOptions] = useState<ComboboxOptions[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<ComboboxOptions[]>(
    []
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  function setOptions() {
    const options = students?.map((student) => ({
      value: student.id,
      label: `${student.firstName} ${student.lastName}`,
    }));

    setStudentOptions(options || []);
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const studentIds = selectedStudents.map((student) => student.value);
    const payload = {
      ...values,
      studentIds,
    };

    axios
      .post("/api/groups", { ...payload })
      .then((response: AxiosResponse<Group>) => {
        if (response.status === 201) {
          toast.success("Group has been created", {
            description: `${values.name}`,
          });
          form.reset();
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error("Something went wrong. Group wasn't created!", {
          description: `${values.name}`,
        });
        console.error(error);
      })
      .finally(() => setOpen(false));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((current) => !current);
        setTimeout(() => {
          setSelectedStudents([]);
          setOptions();
        }, 100);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-6">Add Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid w-full max-w-md items-center gap-1.5">
              <Label htmlFor="students">Students</Label>
              <Combobox
                options={studentOptions || []}
                onChange={(value) => {
                  console.log("value :>> ", value);
                  handleAddStudent(value);
                }}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Selected students</p>
              <Separator />
              {!selectedStudents.length ? (
                <p className="text-sm py-4 px-2">0 students selected.</p>
              ) : (
                <ScrollArea className="max-h-[400px] py-4 px-1 ">
                  <div className="flex flex-col">
                    {selectedStudents.map((student, index) => (
                      <div
                        className="flex justify-between items-center hover:bg-muted transition-all rounded-lg p-1 group"
                        key={student.value}
                      >
                        <p className="text-sm ml-2">
                          {index + 1}. {student.label}
                        </p>
                        {/* <Button
                          onClick={() => {
                            handleRemoveStudent(student.value);
                          }}
                          className="w-6 h-6 p-1"
                          variant="ghost"
                        >
                          <XIcon className="w-3 h-3" />
                        </Button> */}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button asChild variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
