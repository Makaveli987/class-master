"use client";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, subMonths } from "date-fns";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { MonthlyRevenue } from "./_components/monthly-revenue";
import OverviewStats from "./_components/overview-stats";
import { RevenueByCourse } from "./_components/revenue-by-course";
import StudentsStats from "./_components/students-stats";
import { MonthlyNewStudents } from "./_components/monthly-new-students";
import GroupsStats from "./_components/groups-stats";
import { EnrollmentsByCourse } from "./_components/enrollments-by-course";
import CompletedEnrollments from "./_components/completed-enrollments";
import { MonthlyNewEnrollments } from "./_components/monthly-new-enrollments";

export default function Analytics() {
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });

  return (
    <div className="max-w-screen-2xl m-auto">
      <h3 className="pb-4 font-medium tracking-tight text-xl">Analytics</h3>
      <OverviewStats />
      <Card className="pt-6">
        <CardContent>
          <Tabs defaultValue="finance">
            <div className="flex flex-col md:flex-row justify-start items-center">
              <TabsList>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="students">Students - Groups</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
              <div className="md:ml-auto mt-4 md:mt-0 flex items-center gap-2">
                <DateRangePicker date={date} setDate={setDate} />
              </div>
            </div>
            <TabsContent className="mt-3" value="finance">
              <div className="mt-3 flex flex-col xl:flex-row gap-6">
                <MonthlyRevenue date={date} />
                <RevenueByCourse />
              </div>
            </TabsContent>
            <TabsContent className="mt-3" value="students">
              <div className="mt-3 flex flex-col xl:flex-row gap-6">
                <div className="flex flex-col md:flex-row gap-6 xl:w-2/5">
                  <StudentsStats />
                  <GroupsStats />
                </div>
                <MonthlyNewStudents date={date} />
              </div>
            </TabsContent>
            <TabsContent className="mt-3" value="courses">
              <div className="mt-3 flex flex-col xl:flex-row gap-6 ">
                <div className="flex flex-col md:flex-row md:w-2/5 gap-6 flex-1">
                  <EnrollmentsByCourse />
                  <CompletedEnrollments />
                </div>
                <MonthlyNewEnrollments date={date} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
