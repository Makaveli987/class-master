"use client";
import { verifyEmail } from "@/actions/verification-token/verify-email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ArrowLeftIcon, CheckCircle2Icon, KeyRoundIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function VerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      return;
    }

    await verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong.");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="mx-auto bg-card text-card-foreground w-[400px] p-10 shadow-sm border rounded-lg">
      <div className="flex flex-col gap-4 items-center justify-center">
        <KeyRoundIcon className="w-9 h-9 text-primary" />

        <h3
          className="text-lg font-medium leading-6 capitalize bg-card"
          id="modal-title"
        >
          Confirming your verification
        </h3>
        {!success && !error && <BeatLoader className="mx-auto text-blue-500" />}

        {error && (
          <Alert variant="destructive" className="border-0">
            <AlertTitle className="flex items-center justify-center gap-2">
              <ExclamationTriangleIcon className="h-4 w-4" />
              {error}
            </AlertTitle>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="border-0">
            <AlertTitle className="flex items-center justify-center gap-2">
              <CheckCircle2Icon className="h-4 w-4" />
              {success}
            </AlertTitle>
          </Alert>
        )}
        {(success || error) && (
          <Link href={"/sign-in"}>
            <Button className="mx-auto" variant={"ghost"}>
              <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back To Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
