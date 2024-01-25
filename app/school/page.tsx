import { auth } from "@/auth";

export default async function SchoolPage() {
  const session = await auth();
  return (
    <div className="max-w-screen-2xl">
      <p className="">{JSON.stringify(session)}</p>
    </div>
  );
}
