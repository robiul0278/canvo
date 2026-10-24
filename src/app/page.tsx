import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import EditorialBanner from "@/components/EditorialBanner";
import FeaturesSection from "@/components/FeaturesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { Suspense } from "react";

function CollectionsSectionSkeleton() {
  return (
    <section className="py-20 sm:py-28 md:py-32" aria-labelledby="collections-heading">
      <div className="container space-y-unit-6">
        <header className="text-center space-y-unit-2 max-w-2xl mx-auto">
          <span className="inline-block text-caption tracking-widest text-accent font-medium">
            Shop by Category
          </span>
          <h2 id="collections-heading" className="text-display-sm font-light tracking-tight">
            Curated Collections
          </h2>
          <p className="text-body text-muted-foreground">
            Explore our thoughtfully edited selections for the season.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-muted/30 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSectionSkeleton() {
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
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-unit animate-pulse">
              <div className="aspect-[3/4] bg-muted/30 rounded-lg" />
              <div className="h-4 bg-muted/30 rounded w-3/4" />
              <div className="h-4 bg-muted/30 rounded w-1/2" />
              <div className="h-5 bg-muted/30 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <Hero />
        <Suspense fallback={<CollectionsSectionSkeleton />}>
          <CollectionsSection />
        </Suspense>
        <Suspense fallback={<FeaturedProductsSectionSkeleton />}>
          <FeaturedProductsSection />
        </Suspense>
        <EditorialBanner />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}