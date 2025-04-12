"use client";

import { SessionProvider } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthContext } from "@/entities/auth/context/auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  useEffect(() => {
    const authParam = searchParams.get("auth");
    const errorParam = searchParams.get("error");

    if (authParam === "signin") setLoginModalOpen(true);
    if (authParam === "signup") setRegisterModalOpen(true);

    if (errorParam) {
      setErrorTitle("Error de autenticación");

      const errors: Record<string, string> = {
        CredentialsSignin: "Las credenciales proporcionadas son incorrectas.",
        OAuthAccountNotLinked: "Esta cuenta ya está vinculada a otro usuario.",
        EmailSignin:
          "Error al enviar el correo electrónico de inicio de sesión.",
        SessionRequired: "Debes iniciar sesión para acceder a esta página.",
      };

      setErrorDescription(
        errors[errorParam] || "Se produjo un error durante la autenticación."
      );
      setErrorModalOpen(true);
    }
  }, [searchParams]);

  return (
    <AuthContext.Provider
      value={{
        loginModalOpen,
        setLoginModalOpen,
        registerModalOpen,
        setRegisterModalOpen,
        errorModalOpen,
        setErrorModalOpen,
        errorTitle,
        setErrorTitle,
        errorDescription,
        setErrorDescription,
      }}
    >
      <SessionProvider>{children}</SessionProvider>
    </AuthContext.Provider>
  );
};
