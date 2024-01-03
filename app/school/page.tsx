import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function SchoolPage() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/sign-in");
  }
  return (
    <div className="w-full">
      <p className="">School page</p>
    </div>
  );
}
