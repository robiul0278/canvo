"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { signIn } from "@/lib/auth-client";

function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  if (value.startsWith("/login") || value.startsWith("/register")) {
    return "/";
  }
  return value;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error: authError } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message ?? "Unable to sign in. Please check your details and try again.");
        setSubmitting(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("We could not reach the server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16 lg:pt-20">
        <div className="container py-12 sm:py-16">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-caption text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground font-medium">
                Sign In
              </li>
            </ol>
          </nav>

          <div className="max-w-md mx-auto">
            <header className="text-center space-y-unit-2 border-b border-border pb-8">
              <span className="inline-block text-caption tracking-widest text-accent font-medium">
                Welcome Back
              </span>
              <h1 className="text-display-sm font-light tracking-tight">Sign In</h1>
              <p className="text-body text-muted-foreground">
                Access your account to continue shopping with Canvo.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-unit-4 pt-8" noValidate>
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                    setError(null);
                  }}
                  className={`input ${fieldErrors.email ? "input-error" : ""}`}
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-caption text-red-600 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                    setError(null);
                  }}
                  className={`input ${fieldErrors.password ? "input-error" : ""}`}
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                {fieldErrors.password && (
                  <p id="password-error" className="text-caption text-red-600 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-body-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Signing In…" : "Sign In"}
              </button>
            </form>

            <p className="text-body-sm text-muted-foreground text-center pt-6">
              New to Canvo?{" "}
              <Link
                href={
                  redirectTo === "/"
                    ? "/register"
                    : `/register?redirect=${encodeURIComponent(redirectTo)}`
                }
                className="link-underline text-foreground"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
