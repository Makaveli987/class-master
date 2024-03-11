"use client";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./sidebar-mobile";
import { useRouter } from "next/navigation";

export default function SchoolClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/sign-in");
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        {session ? <Sidebar session={session} /> : <Sidebar.Skeleton />}
      </div>

      <div className="flex-1 flex flex-col">
        <Header session={session} />
        <Separator />

        <main className="flex-1 overflow-x-hidden p-6 bg-primary-foreground dashboard-content overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
