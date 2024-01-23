import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { HTMLAttributes } from "react";

interface AccountMenuProps extends HTMLAttributes<HTMLDivElement> {
  initials: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
}

export function AccountMenu({ initials, email, fullName }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:ring-0">
        <Button className="h-10 w-10 rounded-full">{initials}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/school/profile" className="flex items-center w-full">
            <SettingsIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          className="cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4 mr-2 text-muted-foreground" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

AccountMenu.Skeleton = function AccountMenuSkeleton() {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col space-y-1 text-right">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-10 h-2 ml-auto" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
};
