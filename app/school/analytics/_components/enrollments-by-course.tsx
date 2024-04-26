import { getTotalEnrollmentsByCourse } from "@/actions/analytics/get-total-enrollments-by-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { chartValueFormatter } from "@/lib/utils";
import { BarList } from "@tremor/react";

import { useEffect, useState } from "react";

export function EnrollmentsByCourse() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getTotalEnrollmentsByCourse()
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="md:w-3/5 lg:7/12 min-h-[433px] relative flex-1">
      <CardHeader>
        <CardTitle>Total Course Enrollments</CardTitle>
        <p className="pt-12 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
          <span>Course</span>
          <span>Enrollments</span>
        </p>
      </CardHeader>
      <CardContent className="pl-6 pr-12">
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <BarList
            data={data}
            className="mx-auto"
            valueFormatter={chartValueFormatter}
            color={"indigo"}
          />
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
