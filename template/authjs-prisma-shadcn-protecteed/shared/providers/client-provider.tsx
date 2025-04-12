// generate client provider
"use client";

import { AuthModals } from "@/entities/auth/components/auth-modals";
import { useEffect, useState } from "react";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {children}
      <AuthModals />
    </>
  );
};
