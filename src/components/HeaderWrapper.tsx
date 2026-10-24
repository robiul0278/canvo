"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/Header").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 lg:h-20 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-full gap-4">
          <span className="text-heading-sm font-light tracking-tight flex-shrink-0">Canvo</span>
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <span className="text-caption tracking-widest font-medium text-muted-foreground">Women</span>
            <span className="text-caption tracking-widest font-medium text-muted-foreground">Men</span>
            <span className="text-caption tracking-widest font-medium text-muted-foreground">Accessories</span>
            <span className="text-caption tracking-widest font-medium text-muted-foreground">Footwear</span>
          </div>
        </div>
      </nav>
    </header>
  ),
});

export default function HeaderWrapper() {
  return <Header />;
}