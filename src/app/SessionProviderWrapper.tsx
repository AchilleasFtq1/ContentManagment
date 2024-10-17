// src/components/SessionProviderWrapper.tsx

"use client";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { TRPCReactProvider } from "~/trpc/react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: SessionProviderWrapperProps) => {
  return (
    <SessionProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
};

export default SessionProviderWrapper;
