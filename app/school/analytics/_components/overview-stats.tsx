"use client";
import {
  OverviewStatsResponse,
  getOverviewStats,
} from "@/actions/analytics/get-overview-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, BookAIcon, User2Icon, Users2Icon } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";

export default function OverviewStats() {
  const [data, setData] = useState<OverviewStatsResponse>();
  const [error, setError] = useState("");

  useEffect(() => {
    getOverviewStats()
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setError("Failed to fetch data.");
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <div className="size-6 flex justify-center items-center rounded-md bg-emerald-100 text-emerald-600 dark:text-emerald-100 dark:bg-emerald-800">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {data ? (
            <div className="text-2xl font-bold">
              {formatPrice(data?.totalRevenue || 0)}
            </div>
          ) : (
            <Skeleton className="w-24 h-8" />
          )}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Enrolled Courses
          </CardTitle>
          <div className="size-6 flex justify-center items-center rounded-md bg-purple-100 text-purple-600 dark:text-purple-100 dark:bg-purple-800">
            <BookAIcon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {data ? (
            <div className="text-2xl font-bold">
              {data?.totalEnrolledCurses}
            </div>
          ) : (
            <Skeleton className="w-24 h-8" />
          )}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <div className="size-6 flex justify-center items-center rounded-md bg-blue-100 text-blue-600 dark:text-blue-100 dark:bg-blue-800">
            <User2Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {data ? (
            <div className="text-2xl font-bold">{data?.totalStudents}</div>
          ) : (
            <Skeleton className="w-24 h-8" />
          )}
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Groups</CardTitle>
          <div className="size-6 flex justify-center items-center rounded-md bg-orange-100 text-orange-600 dark:text-orange-100 dark:bg-orange-800">
            <Users2Icon className="h-4 w-4 " />
          </div>
        </CardHeader>
        <CardContent>
          {data ? (
            <div className="text-2xl font-bold">{data?.totalGroups}</div>
          ) : (
            <Skeleton className="w-24 h-8" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function OverviewStatsSkeleton() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="size-6 flex justify-center items-center rounded-md bg-purple-100 text-purple-600 dark:text-purple-100 dark:bg-purple-800">
          <Skeleton className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="text-2xl font-bold" />
      </CardContent>
    </Card>
  );
}
