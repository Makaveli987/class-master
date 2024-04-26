import { getNewEnrollmentsPerMonth } from "@/actions/analytics/get-monthly-new-enrollments";
import { RevenuePerMonthResponse } from "@/actions/analytics/get-revenue-per-month";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { DateRange } from "@/lib/models/DaateRange";
import { chartValueFormatter } from "@/lib/utils";
import { AreaChart } from "@tremor/react";
import { useEffect, useState } from "react";

type MonthlyNewEnrollmentsProps = {
  date: DateRange;
};

export function MonthlyNewEnrollments({ date }: MonthlyNewEnrollmentsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<RevenuePerMonthResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getNewEnrollmentsPerMonth(date)
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="relative min-h-[433px] flex-1">
      <CardHeader>
        <CardTitle>Monthly New Enrollments</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <AreaChart
            className="mt-6 "
            data={data}
            index="date"
            yAxisWidth={65}
            categories={["enrollments"]}
            colors={["emerald"]}
            valueFormatter={chartValueFormatter}
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
