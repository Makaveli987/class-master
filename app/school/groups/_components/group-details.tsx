"use client";
import { GroupResponse } from "@/actions/get-groups";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="max-w-4xl py-4 px-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Students</h3>
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

      {!group?.students.length ? (
        <p className="text-sm py-4 px-2">No students selected.</p>
      ) : (
        <ScrollArea className="max-h-[400px] py-4 mt-2" type="always">
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
