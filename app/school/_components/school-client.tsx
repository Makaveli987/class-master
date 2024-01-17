"use client";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./sidebar-mobile";

export default function SchoolClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block">
        {session ? <Sidebar session={session} /> : <Sidebar.Skeleton />}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header session={session} />
        <Separator />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-primary-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
