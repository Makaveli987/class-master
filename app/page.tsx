"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);

    axios
      .post("/api/roles", { type: role })
      .then(() => {
        console.log("Registered");
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-screen w-screen pt-[15%]">
        <div className="flex flex-col gap-4 mx-auto bg-white w-96 p-10 shadow-sm border rounded-lg">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Name</Label>
            <Input
              onChange={(e) => setRole(e.target.value)}
              value={role}
              disabled={isLoading}
              placeholder="Name"
            />
          </div>
          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div> */}
          <Button
            onClick={() => {
              console.log("clicked");

              handleSubmit();
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </main>
  );
}
