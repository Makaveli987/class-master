import { getTotalRevenueByCourse } from "@/actions/analytics/get-total-revenue-by-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";

export function BarChartUsageExample() {
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getTotalRevenueByCourse()
      .then((res: any) => {
        const s = [];
        s.push(res[0]);
        s.push({
          name: "Test 2",
          revenue: 37500,
        });
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="flex-1 min-h-[433px]">
      <CardHeader>
        <CardTitle>Revenue by Course</CardTitle>
      </CardHeader>
      <CardContent className="relative h-4/5">
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <BarChart
            className="mt-6"
            data={data}
            index="name"
            categories={["revenue"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
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
