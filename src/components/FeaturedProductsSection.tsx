import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import ProductCard from "./ProductCard";

export default async function FeaturedProductsSection() {
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <section className="py-20 sm:py-28 md:py-32 bg-muted/30" aria-labelledby="featured-heading">
      <div className="container space-y-unit-6">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-unit-2 max-w-xl">
            <span className="inline-block text-caption tracking-widest text-accent font-medium">
              New Arrivals
            </span>
            <h2 id="featured-heading" className="text-display-sm font-light tracking-tight">
              Latest Additions
            </h2>
          </div>
          <Link href="/products" className="btn btn-link self-start mt-2 sm:mt-0">
            Shop All Products
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}