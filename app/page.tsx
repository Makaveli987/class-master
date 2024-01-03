// "use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/sign-in");
  }
  // const [isLoading, setIsLoading] = useState(false);
  // const [role, setRole] = useState("");

  // const handleSubmit = () => {
  //   setIsLoading(true);

  //   axios
  //     .post("/api/roles", { type: role })
  //     .then(() => {
  //       console.log("Registered");
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-screen w-screen pt-[15%]">
        <div className="flex flex-col gap-4 mx-auto bg-white w-96 p-10 shadow-sm border rounded-lg">
          Home
          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Name</Label>
            <Input
              onChange={(e) => setRole(e.target.value)}
              value={role}
              disabled={isLoading}
              placeholder="Name"
            />
          </div>

          <Button
            onClick={() => {
              console.log("clicked");

              handleSubmit();
            }}
          >
            Sign Up
          </Button> */}
        </div>
      </div>
    </main>
  );
}
