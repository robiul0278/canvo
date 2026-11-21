"use client";

import { createAuthClient } from "better-auth/react";
import * as React from "react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

export const { signIn, signOut, signUp, useSession } = authClient;