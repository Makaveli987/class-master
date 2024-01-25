"use client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/hooks/use-sidebar";
import { RoleType } from "@/lib/models/Roles";
import { cn } from "@/lib/utils";
import {
  BookAIcon,
  BookMarkedIcon,
  CalendarIcon,
  DoorOpenIcon,
  GraduationCapIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes, ReactElement } from "react";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

interface NavLink {
  path: string;
  icon: ReactElement<any, any>;
  label: string;
  isRestricted: boolean;
}

const navLinks: NavLink[] = [
  {
    path: "/school/calendar",
    icon: <CalendarIcon className="w-4 h-4 mr-2" />,
    label: "Calendar",
    isRestricted: false,
  },
  {
    path: "/school/students",
    icon: <User2Icon className="w-4 h-4 mr-2" />,
    label: "Students",
    isRestricted: false,
  },
  {
    path: "/school/groups",
    icon: <Users2Icon className="w-4 h-4 mr-2" />,
    label: "Groups",
    isRestricted: false,
  },
  {
    path: "/school/profile",
    icon: <SettingsIcon className="w-4 h-4 mr-2" />,
    label: "Profile",
    isRestricted: false,
  },
  {
    path: "/school/courses",
    icon: <BookAIcon className="w-4 h-4 mr-2" />,
    label: "Courses",
    isRestricted: true,
  },
  {
    path: "/school/teachers",
    icon: <GraduationCapIcon className="w-4 h-4 mr-2" />,
    label: "Teachers",
    isRestricted: true,
  },
  {
    path: "/school/enrollments",
    icon: <BookMarkedIcon className="w-4 h-4 mr-2" />,
    label: "Enrollments",
    isRestricted: false,
  },
  {
    path: "/school/classrooms",
    icon: <DoorOpenIcon className="w-4 h-4 mr-2" />,
    label: "Classrooms",
    isRestricted: true,
  },
];

export function Sidebar({ className, session }: SidebarProps) {
  const sidebar = useSidebar();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "pb-12 lg:border-r h-full bg-[#020817] overflow-hidden transition-all duration-200",
        className,
        sidebar.isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="h-14 ml-5 flex items-center">
        <Link href="/school/calendar">
          <Logo />
        </Link>
      </div>

      <Separator className="bg-[#1E293B]" />
      <div className={cn("space-y-4 py-5 text-slate-400 transition-all")}>
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isAdmin = session?.user?.role?.type === RoleType.ADMIN;
              const shouldRenderLink = !link.isRestricted || isAdmin;

              return (
                shouldRenderLink && (
                  <Link key={link.path} href={link.path}>
                    <Button
                      variant={
                        pathname.includes(link.path) ? "default" : "ghost"
                      }
                      className={cn(
                        "w-full flex justify-start items-center",
                        !pathname.includes(link.path) &&
                          "hover:bg-slate-700 hover:text-slate-100"
                      )}
                    >
                      {link.icon}
                      {link.label}
                    </Button>
                  </Link>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.Skeleton = function SkeletonSidebar() {
  return (
    <div className="pb-12 w-64 border-r h-full bg-slate-950">
      <div className="h-14 ml-5 flex items-center">
        <Link href="/school/calendar">
          <Logo />
        </Link>
      </div>
      <Separator />

      <div className="space-y-4 py-5">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Skeleton
                key={link.path}
                className="w-full h-9 flex justify-start items-center"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
