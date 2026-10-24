import { db } from "@/db";
import { categories, products, productImages } from "@/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;

export type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

export type CategoryWithProducts = Category & {
  products: ProductWithRelations[];
};

function deriveStockStatus(qty: number): "in_stock" | "low_stock" | "out_of_stock" {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 5) return "low_stock";
  return "in_stock";
}

function mapProductWithStock(product: Product, images: ProductImage[], category: Category): ProductWithRelations {
  return {
    ...product,
    images,
    category,
    stockStatus: deriveStockStatus(product.stockQuantity),
  };
}

export async function getAllProducts(): Promise<ProductWithRelations[]> {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const result: ProductWithRelations[] = [];
  for (const product of allProducts) {
    const [category] = await db.select().from(categories).where(eq(categories.id, product.categoryId));
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.sortOrder);
    if (category) {
      result.push(mapProductWithStock(product, images, category));
    }
  }
  return result;
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const [product] = await db.select().from(products).where(eq(products.slug, slug));
  if (!product) return null;

  const [category] = await db.select().from(categories).where(eq(categories.id, product.categoryId));
  if (!category) return null;

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  return mapProductWithStock(product, images, category);
}

export async function getProductsByCategory(categorySlug: string, excludeProductId?: string): Promise<ProductWithRelations[]> {
  const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
  if (!category) return [];

  const conditions = [eq(products.categoryId, category.id)];
  if (excludeProductId) {
    conditions.push(ne(products.id, excludeProductId));
  }

  const categoryProducts = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt))
    .limit(4);

  const result: ProductWithRelations[] = [];
  for (const product of categoryProducts) {
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.sortOrder);
    result.push(mapProductWithStock(product, images, category));
  }
  return result;
}

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
  return category || null;
}

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}