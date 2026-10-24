"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithRelations, formatPrice } from "@/lib/products";

interface ProductDetailProps {
  product: ProductWithRelations;
  relatedProducts: ProductWithRelations[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const hasDiscount = product.originalPriceCents && product.originalPriceCents > product.priceCents;
  const inStock = product.stockStatus !== "out_of_stock";

  return (
    <article className="pt-16 lg:pt-20 pb-20">
      <div className="container">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-caption text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/collections/${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground font-medium">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div
              className="relative aspect-[3/4] overflow-hidden bg-muted/30"
              role="region"
              aria-label="Product image gallery"
            >
              <Image
                src={product.images[selectedImage]?.url}
                alt={`${product.name} - View ${selectedImage + 1}`}
                fill
                priority
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 text-micro tracking-widest bg-foreground text-background px-2 py-0.5">
                  New
                </span>
              )}
              {hasDiscount && (
                <span className="absolute top-4 right-4 text-micro tracking-widest bg-accent text-foreground px-2 py-0.5">
                  Sale
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Product thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-foreground"
                        : "border-transparent hover:border-border-strong"
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-current={selectedImage === index ? "true" : "false"}
                    role="listitem"
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-unit-6">
            <header className="space-y-unit-2">
              <span className="inline-block text-caption tracking-widest text-accent font-medium">
                {product.category.name}
              </span>
              <h1 className="text-display-sm font-light tracking-tight">
                {product.name}
              </h1>
            </header>

            <div className="flex flex-wrap items-baseline gap-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-heading-lg font-medium" aria-label="Price">
                  {formatPrice(product.priceCents)}
                </span>
                {hasDiscount && (
                  <span className="text-body text-muted-foreground line-through" aria-label="Original price">
                    {formatPrice(product.originalPriceCents!)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-caption tracking-wide bg-accent-light text-accent px-3 py-1 rounded-sm font-medium">
                  Save{" "}
                  {Math.round(((product.originalPriceCents! - product.priceCents) / product.originalPriceCents!) * 100)}%
                </span>
              )}
            </div>

            <p className="text-body text-muted-foreground max-w-xl">
              {product.description}
            </p>

            <div className="space-y-unit-3 pt-4 border-t border-border">
              <div>
                <label htmlFor="size-select" className="label">
                  Size
                </label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="size-select-label">
                  <span id="size-select-label" className="sr-only">
                    Select size
                  </span>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`px-4 py-2.5 text-caption tracking-wide font-medium rounded-sm border transition-all min-w-[48px] ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border-strong hover:border-foreground hover:bg-muted/50"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-caption text-muted-foreground mt-2">
                    Please select a size
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="label">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border-strong rounded-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 text-body hover:bg-muted/50 transition-colors"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="10"
                      className="w-16 text-center border-x border-border-strong bg-transparent focus:outline-none focus:ring-0"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="px-4 py-2.5 text-body hover:bg-muted/50 transition-colors"
                      aria-label="Increase quantity"
                      disabled={quantity >= 10}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-caption text-muted-foreground">
                    (Max 10 per order)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                className="btn btn-primary btn-lg btn-full sm:btn-auto flex-1"
                disabled={!selectedSize || !inStock}
                aria-disabled={!selectedSize || !inStock}
              >
                Add to Bag
              </button>
              <button className="btn btn-secondary btn-lg btn-full sm:btn-auto flex-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Wishlist</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-body-sm text-muted-foreground pt-4 border-t border-border">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>
                {product.stockStatus === "in_stock" && "In stock - usually ships within 24 hours"}
                {product.stockStatus === "low_stock" && `Only ${product.stockQuantity} left in stock`}
                {product.stockStatus === "out_of_stock" && "Out of stock"}
              </span>
            </div>

            <div className="space-y-unit-2 pt-4 border-t border-border">
              <h3 className="text-heading-sm font-medium">Delivery & Returns</h3>
              <ul className="space-y-1.5 text-body-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free express shipping on orders over $500
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30-day returns with complimentary pickup
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure payment with buyer protection
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-20 lg:mt-28" aria-labelledby="details-heading">
          <div className="border-t border-border pt-12">
            <h2 id="details-heading" className="text-display-sm font-light tracking-tight mb-8">
              Product Details
            </h2>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <h3 className="text-heading-sm font-medium">Description</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {product.description} Each piece is crafted with meticulous attention to detail, ensuring exceptional quality and longevity. The design balances contemporary aesthetics with timeless elegance, making it a versatile addition to any wardrobe.
                </p>
                <h3 className="text-heading-sm font-medium">Care Instructions</h3>
                <ul className="space-y-2 text-body-sm text-muted-foreground">
                  <li>• Dry clean only</li>
                  <li>• Do not bleach</li>
                  <li>• Iron on low heat if needed</li>
                  <li>• Store in a cool, dry place</li>
                  <li>• Use padded hangers to maintain shape</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-heading-sm font-medium">Materials & Origin</h3>
                <dl className="space-y-3 text-body-sm">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Main fabric</dt>
                    <dd className="font-medium">100% Premium Wool</dd>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Lining</dt>
                    <dd className="font-medium">100% Silk</dd>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Buttons</dt>
                    <dd className="font-medium">Natural Horn</dd>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Origin</dt>
                    <dd className="font-medium">Made in Italy</dd>
                  </div>
                  <div className="flex justify-between pb-2">
                    <dt className="text-muted-foreground">Fit</dt>
                    <dd className="font-medium">Regular, true to size</dd>
                  </div>
                </dl>
                <h3 className="text-heading-sm font-medium">Sustainability</h3>
                <p className="text-body-sm text-muted-foreground">
                  This product is crafted using responsibly sourced materials. Our manufacturing partners adhere to strict environmental and social standards, ensuring fair working conditions and reduced environmental impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-28" aria-labelledby="related-heading">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="space-y-unit-2">
              <span className="inline-block text-caption tracking-widest text-accent font-medium">
                You May Also Like
              </span>
              <h2 id="related-heading" className="text-display-sm font-light tracking-tight">
                Complete the Look
              </h2>
            </div>
            <Link href="/products" className="btn btn-link">
              View All Products
            </Link>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
                className="group card overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
                  <Image
                    src={relatedProduct.images[0]?.url}
                    alt={relatedProduct.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 space-y-unit">
                  <p className="text-caption tracking-widest text-muted-foreground">
                    {relatedProduct.category.name}
                  </p>
                  <h3 className="text-body font-normal tracking-tight group-hover:text-accent transition-colors line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-body font-medium">
                      {formatPrice(relatedProduct.priceCents)}
                    </span>
                    {relatedProduct.originalPriceCents && relatedProduct.originalPriceCents > relatedProduct.priceCents && (
                      <span className="text-body-sm text-muted-foreground line-through">
                        {formatPrice(relatedProduct.originalPriceCents)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}