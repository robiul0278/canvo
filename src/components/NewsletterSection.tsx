"use client";

import { useState, FormEvent } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-20 sm:py-28 bg-foreground text-background" aria-labelledby="newsletter-heading">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-unit-4">
          <header className="space-y-unit-2">
            <h2 id="newsletter-heading" className="text-display-sm font-light tracking-tight text-background">
              Join Our World
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Receive early access to new collections, exclusive invitations, and editorial stories.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input flex-1 bg-transparent border-border-strong placeholder:text-muted-foreground focus:ring-ring"
              disabled={status === "submitting" || status === "success"}
              required
              autoComplete="email"
              aria-describedby="email-status"
            />
            <button
              type="submit"
              className="btn btn-secondary bg-background text-foreground border-border-strong hover:bg-muted whitespace-nowrap"
              disabled={status === "submitting" || status === "success"}
              aria-busy={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Subscribing...</span>
                </>
              ) : status === "success" ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </button>
          </form>

          <p id="email-status" className="text-caption text-muted-foreground" aria-live="polite">
            {status === "success" && "Thank you for subscribing. Check your inbox for a confirmation."}
            {status === "error" && "Something went wrong. Please try again."}
            {!status || status === "idle" ? (
              "By subscribing, you agree to our Privacy Policy. Unsubscribe anytime."
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}