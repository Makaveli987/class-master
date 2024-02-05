import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-screen w-screen pt-[15%]">
        <div className="flex flex-col gap-4 mx-auto bg-white w-96 p-10 shadow-sm border rounded-lg">
          <Link href={"/school/calendar"}>
            <Button>
              Go to App
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
