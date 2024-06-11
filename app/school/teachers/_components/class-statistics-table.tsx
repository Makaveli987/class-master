"use client";
import { DataTable } from "@/components/ui/data-table/data-table";

import {
  TotalClassesByTeacher,
  getTotalClassesByTeacherPerMonth,
} from "@/actions/classes/get-class-statistics-by-teacher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subMonths } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { classStatisticsColumns } from "./class-statistics-columns";

interface TotalClassesTableProps {
  teacherId: string;
}

export default function ClassStatisticsTable({
  teacherId,
}: TotalClassesTableProps) {
  const router = useRouter();

  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });

  const [totalClasses, setTotalClasses] = useState<TotalClassesByTeacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getTotalClassesByTeacherPerMonth(teacherId, date)
      .then((res) => {
        setTotalClasses(res.data);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, [date]);

  return (
    <Card className="border-0">
      <CardHeader className=" flex flex-row justify-between items-start">
        <div className="space-y-1.5">
          <CardTitle>Class Statistics</CardTitle>
          <CardDescription>
            Total number of classes held per month
          </CardDescription>
        </div>
        <DateRangePicker
          date={date}
          setDate={setDate}
          disabledRange={{ after: new Date() }}
        />
      </CardHeader>
      <CardContent>
        <DataTable
          headerClassName="rounded-t-md bg-muted/50"
          columns={classStatisticsColumns}
          data={totalClasses || []}
          filterPlaceholder="Search month..."
          showSearchInput={false}
          isLoading={isLoading}
        ></DataTable>

        {error && (
          <div className="flex flex-1 justify-center items-center h-full text-sm text-muted-foreground">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
