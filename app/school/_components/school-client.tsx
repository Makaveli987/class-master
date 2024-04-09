"use client";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "./header";
import { Sidebar } from "./sidebar";

export default function SchoolClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const sidebar = useSidebar();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/sign-in");
    },
  });

  return (
    // <div className="flex h-screen overflow-hidden">
    //   <div className="hidden lg:block">
    //     {session ? <Sidebar session={session} /> : <Sidebar.Skeleton />}
    //   </div>

    //   <div className="flex-1 flex flex-col">
    //     <Header session={session} />
    //     <Separator />

    //     <main className="flex-1 overflow-x-hidden p-6 bg-primary-foreground dashboard-content overflow-auto">
    //       {children}
    //     </main>
    //   </div>
    // </div>
    <div className="min min-h-screen flex">
      <div className="hidden lg:block">
        {session ? <Sidebar session={session} /> : <Sidebar.Skeleton />}
      </div>

      <div
        className={cn(
          "flex-1 flex flex-col transition-all pl-0",
          sidebar.isOpen ? "md:pl-56" : "pl-0"
        )}
      >
        <Header session={session} />
        <Separator />

        <main className="flex-1 overflow-x-hidden p-6 bg-primary-foreground dashboard-content overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
