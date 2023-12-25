"use client";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "./sidebar";
import Header from "./header";
import { useSession } from "next-auth/react";

export default function SchoolClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen ">
      <Sidebar session={session} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header session={session} />
        <Separator />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
