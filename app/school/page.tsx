import { auth } from "@/auth";
import { authOptions } from "@/lib/authOptions";
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SchoolPage() {
  // const session = await getServerSession(authOptions);
  // if (session == null) {
  //   return redirect("/sign-in");
  // }
  const session = await auth();
  return (
    <div className="max-w-screen-2xl">
      <p className="">{JSON.stringify(session)}</p>
    </div>
  );
}
