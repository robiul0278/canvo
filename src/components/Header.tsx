"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { label: "Women", href: "/collections/womens" },
  { label: "Men", href: "/collections/mens" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Footwear", href: "/collections/footwear" },
  { label: "Sale", href: "/products?sale=true" },
  { label: "New Arrivals", href: "/products?sort=new" },
];

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
      role="banner"
    >
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          <Link
            href="/"
            className="text-heading-sm font-light tracking-tight flex-shrink-0"
            aria-label="Canvo Home"
          >
            Canvo
          </Link>

          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-caption tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              href="/account"
              className="hidden lg:flex items-center gap-2 p-2 text-caption tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Wishlist (0 items)"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Shopping cart (0 items)"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-6 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-body font-medium text-foreground py-2 border-b border-border/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <Link href="/account" className="text-body font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  My Account
                </Link>
                {session?.user ? (
                  <button
                    onClick={() => signOut()}
                    className="text-body font-medium text-accent text-left"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link href="/login" className="text-body font-medium text-accent" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-background lg:hidden animate-fade-in" role="dialog" aria-modal="true" aria-label="Search">
            <div className="container h-full flex flex-col">
              <div className="flex items-center justify-between h-16">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="flex-1 flex items-start justify-center pt-8" role="search">
                <label htmlFor="mobile-search" className="sr-only">Search products</label>
                <input
                  id="mobile-search"
                  type="search"
                  placeholder="Search products, collections..."
                  className="input w-full max-w-md text-lg bg-transparent border-border-strong focus:ring-ring placeholder:text-muted-foreground"
                  autoFocus
                  autoComplete="off"
                />
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}