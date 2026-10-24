"use client";

import { AuthProvider as BaseAuthProvider } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
}