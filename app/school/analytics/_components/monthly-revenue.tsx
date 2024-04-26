import {
  RevenuePerMonthResponse,
  getRevenuePerMonth,
} from "@/actions/analytics/get-revenue-per-month";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { AreaChart } from "@tremor/react";
import { useEffect, useState } from "react";
import { chartValueFormatter } from "@/lib/utils";
import { DateRange } from "@/lib/models/DaateRange";

type MonthlyRevenueProps = {
  date: DateRange;
};

export function MonthlyRevenue({ date }: MonthlyRevenueProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<RevenuePerMonthResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getRevenuePerMonth(date)
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, [date]);

  return (
    <Card className="relative min-h-[433px] w-full xl:w-3/5">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <AreaChart
            className="mt-6"
            data={data}
            index="date"
            yAxisWidth={65}
            categories={["revenue"]}
            colors={["green"]}
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
