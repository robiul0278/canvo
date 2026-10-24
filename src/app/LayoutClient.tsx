"use client";

import Header from "@/components/HeaderWrapper";
import { AuthProvider } from "@/lib/auth-client";
import { ReactNode } from "react";

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}