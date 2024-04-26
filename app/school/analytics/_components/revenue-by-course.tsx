import { getTotalRevenueByCourse } from "@/actions/analytics/get-total-revenue-by-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/page-loader";
import { chartValueFormatter } from "@/lib/utils";
import { BarList } from "@tremor/react";
import { useEffect, useState } from "react";

export function RevenueByCourse() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getTotalRevenueByCourse()
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card className="flex-1 min-h-[433px] relative">
      <CardHeader>
        <CardTitle>Total Revenue by Course</CardTitle>
        <p className="pt-12 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
          <span>Course</span>
          <span>Revenue</span>
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && !error ? (
          <div className=" flex-1">
            <Loader />
          </div>
        ) : (
          <BarList
            showAnimation
            data={data}
            className="mx-auto"
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
