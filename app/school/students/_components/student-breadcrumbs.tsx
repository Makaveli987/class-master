"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type StudentBeadcrumbsProps = {
  student?: { name: string; id: string };
  enrollment?: { name: string; id: string };
};

export function StudentBreadcrumbs({
  student,
  enrollment,
}: StudentBeadcrumbsProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { displayName: string; link: string }[]
  >([]);

  useEffect(() => {
    const fetchBreadcrumbData = (): void => {
      const pathParts = pathname.split("/").filter((crumb) => crumb !== "");
      const newBreadcrumbs = [];

      for (let i = 1; i <= pathParts.length; i++) {
        let crumb = pathParts[i];
        let displayName = crumb.charAt(0).toUpperCase() + crumb.slice(1);

        if (crumb === student?.id) {
          displayName = student?.name;
          i++;
        }

        if (crumb === enrollment?.id) {
          displayName = enrollment?.name;
          i++;
        }

        newBreadcrumbs.push({
          displayName,
          link: `/${pathParts.slice(0, i + 1).join("/")}`,
        });
      }

      setBreadcrumbs(newBreadcrumbs);
    };

    fetchBreadcrumbData();
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div
            className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
            key={index}
          >
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.displayName}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.link}>
                  {breadcrumb.displayName}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
