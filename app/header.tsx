"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function header() {
  return (
    <div className="p-6 flex gap-4">
      <Button onClick={() => signOut()}>Logout</Button>
      <Link href="/sign-in">
        <Button>Login </Button>
      </Link>
      <Link href="/sign-up">
        <Button>Sign Up </Button>
      </Link>
    </div>
  );
}
