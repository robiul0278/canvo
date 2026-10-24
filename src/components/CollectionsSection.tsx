import { getAllCategories } from "@/lib/products";
import CollectionCard from "./CollectionCard";

export default async function CollectionsSection() {
  const categories = await getAllCategories();

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
          {categories.map((category, index) => (
            <CollectionCard
              key={category.id}
              collection={{
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                image: category.imageUrl || "",
                imageAlt: category.name,
                ctaText: `Shop ${category.name}`,
                ctaHref: `/collections/${category.slug}`,
              }}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <a href="/collections" className="btn btn-link">
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
}