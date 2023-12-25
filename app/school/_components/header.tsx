"use client";
import { Button } from "@/components/ui/button";
import { GraduationCapIcon, School2Icon, SchoolIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React, { HTMLAttributes } from "react";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <div className="h-14 w-full flex items-center justify-between px-6">
      <span className="text-sm text-slate-600 font-semibold flex items-center gap-2">
        <GraduationCapIcon className="w-5" />
        {session?.user.School.name}
      </span>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
