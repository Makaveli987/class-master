"use client";
import { getCompletedEnrollments } from "@/actions/analytics/get-completed-enrollments";
import { getStudentsStats } from "@/actions/analytics/get-students-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { DonutChart } from "@tremor/react";

import { useEffect, useState } from "react";

export default function CompletedEnrollments() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getCompletedEnrollments()
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="min-h-[433px] relative md:w-2/5 lg:5/12 p-0">
      <CardHeader>
        <CardTitle>Enrollments</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <DonutChart
              data={data}
              variant="donut"
              colors={["emerald", "sky"]}
              className="w-40 p-0"
            />

            <div className="flex flex-col w-full lg:w-44 mt-10 mx-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="size-2.5 bg-emerald-500 rounded-sm mr-2.5"></div>
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                </div>
                <span>{data[0]?.value}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="size-2.5 bg-sky-500 rounded-sm mr-2.5"></div>
                  <span className="text-sm text-muted-foreground">
                    In Progress
                  </span>
                </div>
                <span>{data[1]?.value}</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex flex-1 justify-center items-center h-full text-sm text-muted-foreground">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
