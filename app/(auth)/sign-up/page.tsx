import getCurrentUser from "@/actions/get-current-user";
import React from "react";
import SignUpClient from "./sign-up-client";

export default async function SignUp() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignUpClient />
    </div>
  );
}
