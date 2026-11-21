import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getOrderByNumber } from "@/lib/orders";
import { PAYMENT_METHODS } from "@/lib/payments";

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Order Details | Canvo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const result = await getOrderByNumber(orderNumber);

  if (!result) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect(`/login?redirect=${encodeURIComponent(`/orders/${orderNumber}`)}`);
  }

  if (result.order.userId !== session.user.id) {
    notFound();
  }

  const { order, items } = result;
  const method = PAYMENT_METHODS.find((entry) => entry.id === order.paymentMethod);
  const placedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(order.createdAt);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16 lg:pt-20">
        <div className="container py-12 sm:py-16 max-w-4xl">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-caption text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground font-medium">
                Order {order.orderNumber}
              </li>
            </ol>
          </nav>

          <header className="text-center space-y-unit-3 border-b border-border pb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-light text-accent">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="block text-caption tracking-widest text-accent font-medium">
              Order Confirmed
            </span>
            <h1 className="text-display-sm font-light tracking-tight">Thank you for your order</h1>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              Order <span className="text-foreground font-medium">{order.orderNumber}</span> was placed on{" "}
              {placedAt}. We will contact you at {order.customerEmail} if we need anything else.
            </p>
          </header>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-10 pt-10">
            <div className="space-y-unit-8">
              <section aria-labelledby="items-heading" className="space-y-unit-4">
                <h2 id="items-heading" className="text-heading-sm font-medium">
                  Items
                </h2>

                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                      <div className="relative w-20 aspect-[3/4] flex-shrink-0 overflow-hidden rounded-sm bg-muted/30">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 flex flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              href={`/products/${item.productSlug}`}
                              className="text-body font-medium hover:text-accent transition-colors"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-caption text-muted-foreground">
                              {item.size ? `Size ${item.size}` : "One size"} · Qty {item.quantity}
                            </p>
                          </div>
                          <span className="text-body font-medium whitespace-nowrap">
                            {formatPrice(item.unitPriceCents * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="shipping-heading" className="space-y-unit-3">
                <h2 id="shipping-heading" className="text-heading-sm font-medium">
                  Shipping Details
                </h2>
                <dl className="space-y-2 text-body-sm">
                  <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium text-right">{order.customerName}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-medium text-right">{order.customerPhone}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground">Address</dt>
                    <dd className="font-medium text-right">
                      {order.shippingAddress}, {order.shippingCity}
                      {order.shippingPostalCode ? ` ${order.shippingPostalCode}` : ""}
                    </dd>
                  </div>
                  {order.notes ? (
                    <div className="flex justify-between gap-4 pb-2">
                      <dt className="text-muted-foreground">Notes</dt>
                      <dd className="font-medium text-right max-w-xs">{order.notes}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            </div>

            <aside className="h-fit border border-border rounded-md p-6 space-y-unit-4 bg-card">
              <h2 className="text-heading-sm font-medium">Order Summary</h2>

              <dl className="space-y-3 text-body-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">{formatPrice(order.subtotalCents)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">
                    {order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-body">
                  <dt className="font-medium">Total</dt>
                  <dd className="font-medium">{formatPrice(order.totalCents)}</dd>
                </div>
              </dl>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between gap-4 text-body-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium">
                    {method ? `${method.label} (${method.shortLabel})` : order.paymentMethod}
                  </span>
                </div>
                {order.bkashNumber ? (
                  <div className="flex items-center justify-between gap-4 text-body-sm">
                    <span className="text-muted-foreground">bKash number</span>
                    <span className="font-medium">{order.bkashNumber}</span>
                  </div>
                ) : null}
                <p className="text-caption text-muted-foreground">
                  {order.paymentMethod === "cod"
                    ? "Payment is due in cash when your order is delivered."
                    : "Your order is reserved. We will send a bKash payment request before dispatch."}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/products" className="btn btn-primary btn-full">
                  Continue Shopping
                </Link>
                <Link href="/" className="btn btn-ghost btn-full">
                  Back to Home
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
