import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const categoriesData = [
  {
    name: "Women",
    slug: "womens",
    description: "Discover the latest silhouettes crafted with exceptional attention to detail.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
  },
  {
    name: "Men",
    slug: "mens",
    description: "Refined tailoring meets contemporary ease for the modern wardrobe.",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "The finishing touches that define personal style.",
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Architectural forms crafted from the finest materials.",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80",
  },
];

const productsData = [
  {
    name: "Silk-Blend Blazer",
    slug: "silk-blend-blazer",
    description: "Tailored blazer in lustrous silk blend with notch lapels and single-button closure.",
    priceCents: 189000,
    originalPriceCents: 220000,
    categorySlug: "womens",
    isNew: true,
    isSale: true,
    stockQuantity: 12,
    images: [
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", alt: "Silk-Blend Blazer front view", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Silk-Blend Blazer back view", sortOrder: 1 },
    ],
  },
  {
    name: "Cashmere Overcoat",
    slug: "cashmere-overcoat",
    description: "Double-faced cashmere coat with relaxed fit and hidden button placket.",
    priceCents: 345000,
    originalPriceCents: null,
    categorySlug: "womens",
    isNew: true,
    isSale: false,
    stockQuantity: 8,
    images: [
      { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", alt: "Cashmere Overcoat front view", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80", alt: "Cashmere Overcoat side view", sortOrder: 1 },
    ],
  },
  {
    name: "Structured Leather Tote",
    slug: "structured-leather-tote",
    description: "Italian calfskin tote with top handles, detachable strap, and gold-tone hardware.",
    priceCents: 210000,
    originalPriceCents: null,
    categorySlug: "accessories",
    isNew: true,
    isSale: false,
    stockQuantity: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", alt: "Structured Leather Tote front", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", alt: "Structured Leather Tote side", sortOrder: 1 },
    ],
  },
  {
    name: "Wool Tailored Trousers",
    slug: "wool-tailored-trousers",
    description: "High-rise wool trousers with pressed creases and side adjusters.",
    priceCents: 68000,
    originalPriceCents: 85000,
    categorySlug: "mens",
    isNew: false,
    isSale: true,
    stockQuantity: 25,
    images: [
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80", alt: "Wool Tailored Trousers front", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", alt: "Wool Tailored Trousers back", sortOrder: 1 },
    ],
  },
  {
    name: "Oxford Cotton Shirt",
    slug: "oxford-cotton-shirt",
    description: "Classic oxford cloth shirt with button-down collar and mother-of-pearl buttons.",
    priceCents: 28000,
    originalPriceCents: null,
    categorySlug: "mens",
    isNew: false,
    isSale: false,
    stockQuantity: 30,
    images: [
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", alt: "Oxford Cotton Shirt front", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", alt: "Oxford Cotton Shirt detail", sortOrder: 1 },
    ],
  },
  {
    name: "Chelsea Leather Boots",
    slug: "chelsea-leather-boots",
    description: "Handcrafted Chelsea boots in polished calfskin with elastic side panels.",
    priceCents: 89000,
    originalPriceCents: null,
    categorySlug: "footwear",
    isNew: true,
    isSale: false,
    stockQuantity: 18,
    images: [
      { url: "https://images.unsplash.com/photo-1520639888713-5d8f5e8c8a5c?w=800&q=80", alt: "Chelsea Leather Boots side", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1605297577-fdf2e8b5b3b1?w=800&q=80", alt: "Chelsea Leather Boots front", sortOrder: 1 },
    ],
  },
  {
    name: "Printed Silk Twill Scarf",
    slug: "printed-silk-twill-scarf",
    description: "Hand-rolled edges. 100% silk twill with exclusive seasonal artwork.",
    priceCents: 42000,
    originalPriceCents: null,
    categorySlug: "accessories",
    isNew: false,
    isSale: false,
    stockQuantity: 40,
    images: [
      { url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80", alt: "Printed Silk Twill Scarf laid flat", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1584030373294-05e5ed22d4b1?w=800&q=80", alt: "Printed Silk Twill Scarf worn", sortOrder: 1 },
    ],
  },
  {
    name: "Leather Low-Top Sneakers",
    slug: "leather-low-top-sneakers",
    description: "Minimalist leather sneakers with tonal stitching and cushioned insole.",
    priceCents: 54000,
    originalPriceCents: 65000,
    categorySlug: "footwear",
    isNew: false,
    isSale: true,
    stockQuantity: 22,
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", alt: "Leather Low-Top Sneakers side", sortOrder: 0 },
      { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", alt: "Leather Low-Top Sneakers top", sortOrder: 1 },
    ],
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const cat of categoriesData) {
    await sql`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.imageUrl})
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log(`Created category: ${cat.name}`);
  }

  const categoriesResult = await sql`SELECT id, slug FROM categories`;
  const categoryMap = new Map(categoriesResult.map((c) => [c.slug, c.id]));

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.error(`Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const productResult = await sql`
      INSERT INTO products (name, slug, description, price_cents, original_price_cents, category_id, is_new, is_sale, stock_quantity)
      VALUES (${prod.name}, ${prod.slug}, ${prod.description}, ${prod.priceCents}, ${prod.originalPriceCents}, ${categoryId}, ${prod.isNew}, ${prod.isSale}, ${prod.stockQuantity})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price_cents = EXCLUDED.price_cents,
        original_price_cents = EXCLUDED.original_price_cents,
        category_id = EXCLUDED.category_id,
        is_new = EXCLUDED.is_new,
        is_sale = EXCLUDED.is_sale,
        stock_quantity = EXCLUDED.stock_quantity
      RETURNING id
    `;

    const productId = productResult[0].id;
    console.log(`Created product: ${prod.name} (${productId})`);

    for (const img of prod.images) {
      await sql`
        INSERT INTO product_images (product_id, url, alt_text, sort_order)
        VALUES (${productId}, ${img.url}, ${img.alt}, ${img.sortOrder})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);