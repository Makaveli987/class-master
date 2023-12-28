import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface CourseStatsCardProps {
  title: string;
  amount?: number | null;
  icon: React.ReactNode;
}

export default function CourseStatsCard({
  title,
  amount,
  icon,
}: CourseStatsCardProps) {
  return (
    <Card className="w-72 max-w-[280px] border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
      </CardContent>
    </Card>
  );
}
