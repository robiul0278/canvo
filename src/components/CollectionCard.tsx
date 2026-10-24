"use client";

import Image from "next/image";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
}

interface CollectionCardProps {
  collection: Collection;
  variant?: "default" | "featured";
}

export default function CollectionCard({ collection, variant = "default" }: CollectionCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article className="relative group overflow-hidden card">
      <Link
        href={collection.ctaHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={collection.name}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.imageAlt}
            fill
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading={isFeatured ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end">
          <div className="space-y-unit-2 animate-slide-up">
            <span className="inline-block text-caption tracking-widest text-accent font-medium">
              {collection.name.toUpperCase()}
            </span>
            <h2 className="text-heading-lg sm:text-heading-xl font-light tracking-tight text-card-foreground">
              {collection.name}
            </h2>
            <p className="text-body-sm text-muted-foreground max-w-xs hidden sm:block">
              {collection.description}
            </p>
            <div className="flex items-center gap-2 text-caption tracking-wide font-medium text-accent group-hover:gap-3 transition-gap">
              <span>{collection.ctaText}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}