"use client";
import { GroupResponse } from "@/actions/get-groups";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useGroupDialog from "@/hooks/use-group-dialog";
import { DialogAction } from "@/lib/models/dialog-actions";
import { Student } from "@prisma/client";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GroupDetailsProps {
  group?: GroupResponse;
  students?: Student[];
}

export default function GroupDetails({ group, students }: GroupDetailsProps) {
  const groupDialog = useGroupDialog();
  return (
    <div className="max-w-4xl pt-4 px-6">
      {/* {group?.description && ( */}
      <>
        <div className="flex gap-16 justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At quos
              doloribus dolor?
            </p>
          </div>
          <Button
            onClick={() => {
              groupDialog.open({
                data: group,
                action: DialogAction.EDIT,
                students: students || [],
              });
            }}
            variant="outline"
          >
            <EditIcon className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>

        <Separator className="my-6" />
      </>
      {/* )} */}

      <h3 className="font-semibold">Students</h3>

      {!group?.students.length ? (
        <p className="text-sm py-4 px-2">No students selected.</p>
      ) : (
        <ScrollArea className="max-h-[400px] " type="always">
          {group.students.map((student) => (
            <div key={student.id} className="max-h-96 ">
              <Link href={`/school/students/${student.id}`}>
                <div className="flex gap-3 items-center px-2 py-1 hover:bg-muted rounded-md cursor-pointer">
                  <div className="rounded-full flex items-center justify-center w-8 h-8 bg-muted relative">
                    <Image
                      src="/male-student.png"
                      width={28}
                      height={28}
                      alt="student"
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {student.firstName + " " + student.lastName}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
