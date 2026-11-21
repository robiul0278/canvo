"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { calculateShipping, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payments";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  bkashNumber: string;
}

const emptyForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
  bkashNumber: "",
};

interface CheckoutFormProps {
  initialName?: string;
  initialEmail?: string;
}

export default function CheckoutForm({ initialName, initialEmail }: CheckoutFormProps) {
  const router = useRouter();
  const { items, itemCount, subtotalCents, hydrated, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    ...emptyForm,
    name: initialName ?? "",
    email: initialEmail ?? "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cod");
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shippingCents = calculateShipping(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const update = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError(null);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.phone.replace(/\D/g, "").length < 6) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!form.address.trim()) nextErrors.address = "Enter your delivery address.";
    if (!form.city.trim()) nextErrors.city = "Enter your city.";

    if (paymentMethod === "bkash" && !/^01[3-9]\d{8}$/.test(form.bkashNumber.replace(/\D/g, ""))) {
      nextErrors.bkashNumber = "Enter a valid 11-digit bKash number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            postalCode: form.postalCode.trim(),
            notes: form.notes.trim(),
          },
          paymentMethod,
          bkashNumber: paymentMethod === "bkash" ? form.bkashNumber.replace(/\D/g, "") : "",
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.status === 401) {
        router.push("/login?redirect=%2Fcheckout");
        return;
      }

      const data = (await response.json()) as {
        error?: string;
        orderNumber?: string;
        totalCents?: number;
      };

      if (!response.ok || !data.orderNumber) {
        setServerError(data.error ?? "We could not place your order. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      setSubmitting(false);
      router.push(`/orders/${data.orderNumber}`);
    } catch {
      setServerError("We could not reach the server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16 lg:pt-20">
        <div className="container py-12 sm:py-16">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-caption text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground font-medium">
                Checkout
              </li>
            </ol>
          </nav>

          <header className="border-b border-border pb-8 space-y-unit-2">
            <span className="inline-block text-caption tracking-widest text-accent font-medium">
              Secure Checkout
            </span>
            <h1 className="text-display-md font-light tracking-tight">Checkout</h1>
          </header>

          {!hydrated ? (
            <div className="py-20 text-center text-body text-muted-foreground">Loading checkout…</div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-unit-3">
              <h2 className="text-heading-lg font-light tracking-tight">Your bag is empty</h2>
              <p className="text-body text-muted-foreground max-w-md mx-auto">
                Add a few pieces to your bag before checking out.
              </p>
              <Link href="/products" className="btn btn-primary inline-flex">
                Shop New Arrivals
              </Link>
            </div>
          ) : (
            <form onSubmit={placeOrder} className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-16 pt-10" noValidate>
              <div className="space-y-unit-8">
                <section className="space-y-unit-4" aria-labelledby="contact-heading">
                  <h2 id="contact-heading" className="text-heading-sm font-medium">
                    Contact & Shipping
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">Full name</label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        className={`input ${errors.name ? "input-error" : ""}`}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && <p id="name-error" className="text-caption text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="label">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        className={`input ${errors.email ? "input-error" : ""}`}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && <p id="email-error" className="text-caption text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="label">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        className={`input ${errors.phone ? "input-error" : ""}`}
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && <p id="phone-error" className="text-caption text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="city" className="label">City</label>
                      <input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={(event) => update("city", event.target.value)}
                        className={`input ${errors.city ? "input-error" : ""}`}
                        autoComplete="address-level2"
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby={errors.city ? "city-error" : undefined}
                      />
                      {errors.city && <p id="city-error" className="text-caption text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="label">Address</label>
                      <input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={(event) => update("address", event.target.value)}
                        className={`input ${errors.address ? "input-error" : ""}`}
                        autoComplete="street-address"
                        aria-invalid={Boolean(errors.address)}
                        aria-describedby={errors.address ? "address-error" : undefined}
                      />
                      {errors.address && <p id="address-error" className="text-caption text-red-600 mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="label">Postal code (optional)</label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={(event) => update("postalCode", event.target.value)}
                        className="input"
                        autoComplete="postal-code"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="notes" className="label">Order notes (optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={form.notes}
                        onChange={(event) => update("notes", event.target.value)}
                        className="input min-h-24"
                        placeholder="Delivery instructions, gift note, or anything else we should know."
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-unit-4" aria-labelledby="payment-heading">
                  <h2 id="payment-heading" className="text-heading-sm font-medium">
                    Payment Method
                  </h2>

                  <fieldset>
                    <legend className="sr-only">Choose a payment method</legend>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => {
                        const selected = paymentMethod === method.id;
                        return (
                          <label
                            key={method.id}
                            className={`relative flex cursor-pointer flex-col gap-1 rounded-md border p-4 transition-colors ${
                              selected
                                ? "border-foreground bg-muted/30"
                                : "border-border-strong hover:border-foreground"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selected}
                              onChange={() => {
                                setPaymentMethod(method.id);
                                setErrors((current) => ({ ...current, bkashNumber: undefined }));
                                setServerError(null);
                              }}
                              className="sr-only"
                            />
                            <span className="flex items-center justify-between gap-3">
                              <span className="text-body font-medium">{method.label}</span>
                              <span
                                aria-hidden="true"
                                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                                  selected ? "border-foreground" : "border-border-strong"
                                }`}
                              >
                                {selected && <span className="h-2 w-2 rounded-full bg-foreground" />}
                              </span>
                            </span>
                            <span className="text-caption tracking-widest text-accent font-medium">
                              {method.shortLabel}
                            </span>
                            <p className="text-body-sm text-muted-foreground">{method.description}</p>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {paymentMethod === "bkash" && (
                    <div className="space-y-unit-2">
                      <label htmlFor="bkashNumber" className="label">bKash mobile number</label>
                      <input
                        id="bkashNumber"
                        name="bkashNumber"
                        type="tel"
                        inputMode="numeric"
                        value={form.bkashNumber}
                        onChange={(event) => update("bkashNumber", event.target.value)}
                        className={`input ${errors.bkashNumber ? "input-error" : ""}`}
                        placeholder="01XXXXXXXXX"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.bkashNumber)}
                        aria-describedby={errors.bkashNumber ? "bkash-error" : "bkash-help"}
                      />
                      {errors.bkashNumber ? (
                        <p id="bkash-error" className="text-caption text-red-600">{errors.bkashNumber}</p>
                      ) : (
                        <p id="bkash-help" className="text-caption text-muted-foreground">
                          We will send a bKash payment request to this number before your order is dispatched.
                        </p>
                      )}
                    </div>
                  )}
                </section>
              </div>

              <aside className="lg:sticky lg:top-28 h-fit border border-border rounded-md p-6 space-y-unit-4 bg-card">
                <h2 className="text-heading-sm font-medium">Order Summary</h2>

                <ul className="space-y-3 text-body-sm">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}:${item.size ?? "default"}`}
                      className="flex items-start justify-between gap-4"
                    >
                      <span className="text-muted-foreground">
                        {item.name}
                        {item.size ? ` · ${item.size}` : ""} × {item.quantity}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-3 text-body-sm border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Subtotal ({itemCount})</dt>
                    <dd className="font-medium">{formatPrice(subtotalCents)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="font-medium">
                      {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-body">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-medium">{formatPrice(totalCents)}</dd>
                  </div>
                </dl>

                {subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS && (
                  <p className="text-caption text-muted-foreground">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} more for free express shipping.
                  </p>
                )}

                {serverError && (
                  <p className="text-body-sm text-red-600" role="alert">{serverError}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? "Placing Order…" : "Place Order"}
                </button>

                <Link href="/cart" className="btn btn-link w-full justify-center">
                  Return to Bag
                </Link>
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
