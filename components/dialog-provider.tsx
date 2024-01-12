"use client";

import { useEffect, useState } from "react";
import NoteDialog from "./notes-dialog/notes-dialog";

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NoteDialog />
    </>
  );
};
