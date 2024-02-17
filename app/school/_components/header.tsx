import { MenuIcon } from "lucide-react";
import { Session } from "next-auth";
import { HTMLAttributes } from "react";
import { AccountMenu } from "./account-menu";
import { ThemeSelector } from "@/components/theme-selector";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./sidebar-mobile";
import { RoleType } from "@/lib/models/role";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const sidebar = useSidebar();
  const initials = `${session?.user.firstName[0]}${session?.user.lastName[0]}`;
  const fullName = `${session?.user.firstName} ${session?.user.lastName}`;
  const color = session?.user?.color;
  const role = session?.user?.role === RoleType.ADMIN ? "Admin" : "Teacher";

  return (
    <div className="h-14 w-full flex items-center justify-between pl-2 pr-6">
      <span className="text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
        <Button
          onClick={() => sidebar.toggle()}
          variant="ghost"
          className="p-2 hidden lg:block w-10 h-10"
        >
          <MenuIcon />
        </Button>
        <MobileSidebar session={session} />
        {/* <GraduationCapIcon className="w-5 h-5 ml-2" /> */}
        {session?.user.school?.name}
      </span>
      {session ? (
        <div className="flex gap-4 items-center">
          <ThemeSelector />
          <div className="hidden md:flex flex-col space-y-1 text-right">
            <p className="text-sm font-semibold leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{role}</p>
          </div>
          <AccountMenu
            initials={initials}
            fullName={fullName}
            email={session?.user?.email}
            color={color}
          />
        </div>
      ) : (
        <AccountMenu.Skeleton />
      )}
    </div>
  );
}
