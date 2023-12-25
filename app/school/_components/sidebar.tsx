"use client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import { RoleType } from "@/lib/models/Roles";
import { cn } from "@/lib/utils";
import {
  BarChart2Icon,
  CalendarIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { HTMLAttributes, ReactElement } from "react";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
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
    path: "/school/teachers",
    icon: <BarChart2Icon className="w-4 h-4 mr-2" />,
    label: "Teachers",
    isRestricted: true,
  },
  {
    path: "/school/analyticas",
    icon: <BarChart2Icon className="w-4 h-4 mr-2" />,
    label: "Analyticas",
    isRestricted: true,
  },
];

export function Sidebar({ className, session }: SidebarProps) {
  console.log("rendered");

  const pathname = usePathname();
  return (
    <div className={cn("pb-12 flex-1 max-w-64 border-r", className)}>
      <div className="h-14 ml-5 flex items-center">
        <Link href="/school/calendar">
          <Logo />
        </Link>
      </div>

      <Separator />
      <div className="space-y-4 py-5">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isAdmin = session?.user.Role.type === RoleType.ADMIN;
              const shouldRenderLink = !link.isRestricted || isAdmin;

              return (
                shouldRenderLink && (
                  <Link key={link.path} href={link.path}>
                    <Button
                      variant={pathname === link.path ? "default" : "ghost"}
                      className="w-full flex justify-start items-center"
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
