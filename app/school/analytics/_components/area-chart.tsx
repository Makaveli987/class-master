import {
  RevenuePerMonthResponse,
  getRevenuePerMonth,
} from "@/actions/analytics/get-revenue-per-month";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { AreaChart } from "@tremor/react";
import { useEffect, useState } from "react";

export function AreaChartUsageExample() {
  const valueFormatter = function (number: number) {
    return new Intl.NumberFormat("us").format(number).toString();
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<RevenuePerMonthResponse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getRevenuePerMonth()
      .then((res: any) => {
        const s = [];
        s.push(res[0]);
        s.push({
          date: "May 24",
          revenue: 37500,
        });
        setData(s);
        console.log("res :>> ", s);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function getTotalRevenue(): number {
    if (!data.length) {
      return 0;
    }

    let totalRevenue = 0;

    data.forEach((item) => (totalRevenue += item.revenue));
    return totalRevenue;
  }

  return (
    <Card className="flex-1 min-h-[433px]">
      <CardHeader>
        <CardTitle>
          Monthly Revenue
          {/* <span className="text-xl">{formatPrice(getTotalRevenue())}</span>{" "} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-4/5">
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
            categories={["revenue"]}
            colors={["green"]}
            valueFormatter={valueFormatter}
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
