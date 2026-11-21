import { NextResponse } from "next/server";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { withTransaction } from "@/db";
import { orderItems, orders, productImages, products } from "@/db/schema";
import { auth } from "@/lib/auth";
import { calculateShipping } from "@/lib/checkout";
import { isPaymentMethodId } from "@/lib/payments";

const itemSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().trim().max(20).nullable().optional(),
  quantity: z.number().int().min(1).max(10),
});

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(6).max(30),
    address: z.string().trim().min(1).max(300),
    city: z.string().trim().min(1).max(120),
    postalCode: z.string().trim().max(30).optional().default(""),
    notes: z.string().trim().max(1000).optional().default(""),
  }),
  paymentMethod: z.string().trim(),
  bkashNumber: z.string().trim().max(20).optional().default(""),
  items: z.array(itemSchema).min(1).max(50),
});

function createOrderNumber(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  return `CV-${random}`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your checkout details and try again." },
      { status: 400 }
    );
  }

  const { customer, paymentMethod, bkashNumber, items } = parsed.data;

  if (!isPaymentMethodId(paymentMethod)) {
    return NextResponse.json({ error: "Unsupported payment method." }, { status: 400 });
  }

  if (paymentMethod === "bkash" && !/^01[3-9]\d{8}$/.test(bkashNumber)) {
    return NextResponse.json(
      { error: "Enter a valid 11-digit bKash mobile number." },
      { status: 400 }
    );
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to place an order." },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    const result = await withTransaction(async (tx) => {
      const productIds = [...new Set(items.map((item) => item.productId))];

      const productRows = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const imageRows =
        productIds.length > 0
          ? await tx
              .select()
              .from(productImages)
              .where(inArray(productImages.productId, productIds))
              .orderBy(productImages.sortOrder)
          : [];

      const productById = new Map(productRows.map((product) => [product.id, product]));
      const imageByProduct = new Map<string, string>();
      for (const image of imageRows) {
        if (!imageByProduct.has(image.productId)) {
          imageByProduct.set(image.productId, image.url);
        }
      }

      const lineItems = items.map((item) => {
        const product = productById.get(item.productId);
        if (!product) {
          throw new CheckoutError("One of the items in your bag is no longer available.");
        }
        if (product.stockQuantity < item.quantity) {
          throw new CheckoutError(`${product.name} has only ${product.stockQuantity} left in stock.`);
        }

        return {
          product,
          size: item.size ?? null,
          quantity: item.quantity,
        };
      });

      for (const line of lineItems) {
        const [updated] = await tx
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${line.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(products.id, line.product.id),
              gte(products.stockQuantity, line.quantity)
            )
          )
          .returning({ id: products.id });

        if (!updated) {
          throw new CheckoutError(
            `${line.product.name} no longer has enough stock for this order.`
          );
        }
      }

      const subtotalCents = lineItems.reduce(
        (sum, line) => sum + line.product.priceCents * line.quantity,
        0
      );
      const shippingCents = calculateShipping(subtotalCents);
      const totalCents = subtotalCents + shippingCents;

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: createOrderNumber(),
          userId,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pending" : "awaiting_payment",
          status: "pending",
          subtotalCents,
          shippingCents,
          totalCents,
          customerName: session.user.name ?? customer.name,
          customerEmail: session.user.email,
          customerPhone: customer.phone,
          shippingAddress: customer.address,
          shippingCity: customer.city,
          shippingPostalCode: customer.postalCode || null,
          notes: customer.notes || null,
          bkashNumber: paymentMethod === "bkash" ? bkashNumber : null,
        })
        .returning({ id: orders.id, orderNumber: orders.orderNumber });

      await tx.insert(orderItems).values(
        lineItems.map((line) => ({
          orderId: order.id,
          productId: line.product.id,
          productName: line.product.name,
          productSlug: line.product.slug,
          imageUrl: imageByProduct.get(line.product.id) ?? null,
          size: line.size,
          unitPriceCents: line.product.priceCents,
          quantity: line.quantity,
        }))
      );

      return { order, subtotalCents, shippingCents, totalCents };
    });

    return NextResponse.json({
      orderNumber: result.order.orderNumber,
      paymentMethod,
      subtotalCents: result.subtotalCents,
      shippingCents: result.shippingCents,
      totalCents: result.totalCents,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Failed to place order", error);
    return NextResponse.json(
      { error: "We could not place your order. Please try again." },
      { status: 500 }
    );
  }
}

class CheckoutError extends Error {}
