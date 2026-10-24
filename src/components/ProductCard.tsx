"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithRelations, formatPrice } from "@/lib/products";

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPriceCents && product.originalPriceCents > product.priceCents;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPriceCents! - product.priceCents) / product.originalPriceCents!) * 100)
    : 0;

  return (
    <article className="group card overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
          <Image
            src={product.images[0]?.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />

          {(product.isNew || hasDiscount) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="text-micro tracking-widest bg-foreground text-background px-2 py-0.5">
                  New
                </span>
              )}
              {hasDiscount && (
                <span className="text-micro tracking-widest bg-accent text-foreground px-2 py-0.5">
                  -{discountPercent}%
                </span>
              )}
            </div>
          )}

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              className="btn btn-ghost btn-sm bg-card/90 backdrop-blur-sm"
              aria-label={`Quick view ${product.name}`}
            >
              Quick View
            </button>
          </div>
        </div>

        <div className="p-5 space-y-unit">
          <div className="flex items-center justify-between gap-2">
            <p className="text-caption tracking-widest text-muted-foreground">
              {product.category.name}
            </p>
          </div>

          <h3 className="text-body font-normal tracking-tight text-card-foreground group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-body font-medium text-card-foreground">
              {formatPrice(product.priceCents)}
            </span>
            {hasDiscount && (
              <span className="text-body-sm text-muted-foreground line-through">
                {formatPrice(product.originalPriceCents!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}