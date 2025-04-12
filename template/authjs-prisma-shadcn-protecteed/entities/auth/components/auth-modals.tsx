"use client";

import { ErrorModal } from "@/entities/auth/components/error-modal";
import { LoginModal } from "@/entities/auth/components/login-modal";
import { RegisterModal } from "@/entities/auth/components/register-modal";
import { useAuth } from "@/entities/auth/hooks/use-auth";

export const AuthModals = () => {
  const {
    loginModalOpen,
    setLoginModalOpen,
    registerModalOpen,
    setRegisterModalOpen,
    errorModalOpen,
    setErrorModalOpen,
    errorTitle,
    errorDescription,
  } = useAuth();

  return (
    <>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <RegisterModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
      />
      <ErrorModal
        open={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        title={errorTitle}
        description={errorDescription}
      />
    </>
  );
};
