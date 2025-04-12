"use client";

import { createContext } from "react";

type AuthContextType = {
	loginModalOpen: boolean;
	setLoginModalOpen: (open: boolean) => void;
	registerModalOpen: boolean;
	setRegisterModalOpen: (open: boolean) => void;
	errorModalOpen: boolean;
	setErrorModalOpen: (open: boolean) => void;
	errorTitle: string;
	setErrorTitle: (title: string) => void;
	errorDescription: string;
	setErrorDescription: (description: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);
