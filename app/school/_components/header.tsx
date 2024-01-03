import { GraduationCapIcon, School2Icon, SchoolIcon } from "lucide-react";
import { Session } from "next-auth";
import React, { HTMLAttributes } from "react";
import { AccountMenu } from "./account-menu";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const initials = `${session?.user.firstName[0]}${session?.user.lastName[0]}`;
  const fullName = `${session?.user.firstName} ${session?.user.lastName}`;
  const role = session?.user?.role?.type === "ADMIN" ? "Admin" : "Teacher";

  return (
    <div className="h-14 w-full flex items-center justify-between px-6">
      <span className="text-sm text-slate-600 font-semibold flex items-center justify-center gap-2">
        <GraduationCapIcon className="w-5 h-5" />
        {session?.user.school?.name}
      </span>
      {session ? (
        <div className="flex gap-4 items-center">
          <div className="flex flex-col space-y-1 text-right">
            <p className="text-sm font-semibold leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{role}</p>
          </div>
          <AccountMenu
            initials={initials}
            fullName={fullName}
            email={session?.user?.email}
          />
        </div>
      ) : (
        <AccountMenu.Skeleton />
      )}
    </div>
  );
}
