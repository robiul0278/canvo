"use client";

import Image from "next/image";
import Link from "next/link";

export default function EditorialBanner() {
  return (
    <section className="relative py-20 sm:py-28 md:py-32" aria-labelledby="editorial-heading">
      <div className="container">
        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
              alt="Fashion editorial spread showing layered looks"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-unit-4 lg:pl-8">
            <span className="inline-block text-caption tracking-widest text-accent font-medium">
              Editorial
            </span>
            <h2 id="editorial-heading" className="text-display-md font-light tracking-tight">
              The Canvas of <br /> <span className="font-normal">Self&apos;Expression</span>
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-lg">
              This season explores the dialogue between structure and fluidity.
              Architectural tailoring softened by draping silhouettes.
              A palette drawn from nature&apos;s quietest moments.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/collections/womens" className="btn btn-primary">
                Read the Story
              </Link>
              <Link href="/lookbook" className="btn btn-ghost">
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}