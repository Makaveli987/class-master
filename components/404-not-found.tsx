"use client";
import { InfoIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "react-day-picker";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
          <InfoIcon />
        </div>
        <h3 className="text-2xl font-semibold">Page not found</h3>
        <p className="text-muted-foreground text-sm">
          The page you are looking for does not exist.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Go Back
        </Button>
      </div>
    </div>
  );
}
