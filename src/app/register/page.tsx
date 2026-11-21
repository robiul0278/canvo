"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { signUp } from "@/lib/auth-client";

function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  if (value.startsWith("/login") || value.startsWith("/register")) {
    return "/";
  }
  return value;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirect(searchParams.get("redirect"));
  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError(null);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof RegisterForm, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      const { error: authError } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) {
        setError(authError.message ?? "Unable to create your account. Please try again.");
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
                Create Account
              </li>
            </ol>
          </nav>

          <div className="max-w-md mx-auto">
            <header className="text-center space-y-unit-2 border-b border-border pb-8">
              <span className="inline-block text-caption tracking-widest text-accent font-medium">
                Join Canvo
              </span>
              <h1 className="text-display-sm font-light tracking-tight">Create Account</h1>
              <p className="text-body text-muted-foreground">
                Save your details for a faster checkout and follow your orders.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-unit-4 pt-8" noValidate>
              <div>
                <label htmlFor="name" className="label">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={`input ${fieldErrors.name ? "input-error" : ""}`}
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-caption text-red-600 mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
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
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  className={`input ${fieldErrors.password ? "input-error" : ""}`}
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "password-error" : "password-help"}
                />
                {fieldErrors.password ? (
                  <p id="password-error" className="text-caption text-red-600 mt-1">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p id="password-help" className="text-caption text-muted-foreground mt-1">
                    At least 8 characters.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => update("confirmPassword", event.target.value)}
                  className={`input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                  autoComplete="new-password"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <p id="confirm-password-error" className="text-caption text-red-600 mt-1">
                    {fieldErrors.confirmPassword}
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
                {submitting ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <p className="text-body-sm text-muted-foreground text-center pt-6">
              Already have an account?{" "}
              <Link
                href={
                  redirectTo === "/"
                    ? "/login"
                    : `/login?redirect=${encodeURIComponent(redirectTo)}`
                }
                className="link-underline text-foreground"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
