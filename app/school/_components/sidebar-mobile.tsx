"use client";

import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { Sidebar, SidebarProps } from "./sidebar";
import { useMobileSidebar } from "@/hooks/useMobileSidebar";
import { useSidebar } from "@/hooks/useSidebar";

export const MobileSidebar = ({ session }: SidebarProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.open);
  const onClose = useMobileSidebar((state) => state.close);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  const sidebar = useSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => {
          sidebar.open();
          onOpen();
        }}
        className="block lg:hidden"
        variant="ghost"
      >
        <MenuIcon />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar session={session} />
        </SheetContent>
      </Sheet>
    </>
  );
};
