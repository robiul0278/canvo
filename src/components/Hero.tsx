"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt="Fashion editorial background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 container space-y-unit-4 text-center animate-fade-in">
        <span className="inline-block text-caption tracking-widest text-muted-foreground animate-slide-up" style={{ animationDelay: "100ms" }}>
          Autumn / Winter 2024
        </span>

        <h1 className="text-display-xl font-light tracking-tight text-foreground animate-slide-up" style={{ animationDelay: "200ms" }}>
          The Art of <br /> <span className="font-normal">Dressing</span>
        </h1>

        <p className="text-body-lg text-muted-foreground max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "300ms" }}>
          Discover the new season&apos;s essentials &mdash; where heritage craftsmanship meets modern sensibility.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <Link href="/collections/womens" className="btn btn-primary">
            Explore Collection
          </Link>
          <Link href="/collections/mens" className="btn btn-secondary">
            View Lookbook
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <span className="w-24 h-px bg-border-strong" />
          <span>Scroll</span>
          <span className="w-24 h-px bg-border-strong" />
        </div>
        <svg
          className="w-5 h-5 mt-2 text-muted-foreground animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}