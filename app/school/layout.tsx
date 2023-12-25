import type { Metadata } from "next";
import SchoolClient from "./_components/school-client";

export const metadata: Metadata = {
  title: "ClassMaster | School",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SchoolClient>{children}</SchoolClient>;
}
