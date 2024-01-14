import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface StatsCardProps {
  title: string;
  amount?: number | string | null;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export default function StatsCard({
  title,
  amount,
  icon,
  children,
}: StatsCardProps) {
  return (
    <Card className="w-72 max-w-[280px] border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {children ? (
          children
        ) : (
          <div className="text-2xl font-bold">{amount}</div>
        )}
      </CardContent>
    </Card>
  );
}
