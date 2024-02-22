import { auth } from "@/auth";

export default async function SchoolPage() {
  const session = await auth();
  return <div className="max-w-screen-2xl"></div>;
}
