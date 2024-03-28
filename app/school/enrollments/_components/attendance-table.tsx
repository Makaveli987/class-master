import { CheckCircle2Icon, DownloadIcon, XCircleIcon } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AttendanceResponse,
  getAttendance,
} from "@/actions/attendance/get-attendance";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type AttendanceTableProps = {
  enrollmentId: string;
  attendance: AttendanceResponse | null;
};

export default async function AttendanceTable({
  enrollmentId,
  attendance,
}: AttendanceTableProps) {
  return (
    <div>
      <CardHeader className="flex flex-row max-w-4xl">
        <div className="space-y-1.5">
          <CardTitle>Attendance</CardTitle>
          <CardDescription>Stundent attendance by class</CardDescription>
        </div>

        <Button
          className="ml-auto"
          // TODO implement dowload attendance functionality
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download
        </Button>
      </CardHeader>

      <div className="overflow-auto border rounded-md mx-6 mb-6 max-h-96 relative">
        <table className="bg-card w-full">
          <thead className="text-sm bg-card">
            <tr className="text-xs text-muted-foreground sticky top-0 bg-card z-30 shadow-sm">
              <th className="py-8 text-left pl-2 font-semibold sticky left-0 top-0 bg-card z-30 border-r max-w-min">
                Student Name
              </th>

              {attendance?.schoolClasses.map((record) => (
                <th key={record} className="font-semibold w-20 px-4 mr-2">
                  {format(record, "dd. MMM yyyy")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendance?.schoolClasses.length === 0 && (
              <div className="text-sm p-4">There are no classes held.</div>
            )}
            {attendance?.schoolClasses.length! > 0 &&
              attendance?.studentsAttendance.map((record, index) => (
                <tr
                  key={index}
                  className="border-t max-w-min group hover:bg-muted"
                >
                  {Object.values(record).map((value, index) => {
                    return index === 0 ? (
                      <td
                        key={"td-" + index}
                        className="p-2 sticky left-0 text-sm bg-card border-r text-nowrap hover:bg-muted group-hover:bg-muted"
                      >
                        {value}
                      </td>
                    ) : (
                      <td key={"td-" + index} className="px-4">
                        {value ? (
                          <CheckCircle2Icon className="h-5 w-5 mx-auto text-emerald-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
