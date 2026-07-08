"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/builder", label: "Abula Builder" },
  { to: "/tracking", label: "Track Order" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
        >
          Boston Abula Spot<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Open cart"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              pathname === "/cart"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {/* Hamburger Menu Toggle Button for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Floating mobile navigation menu card */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-[72px] z-50 rounded-3xl border border-border/80 bg-background/95 p-4 backdrop-blur-xl shadow-elegant animate-in fade-in slide-in-from-top-3 duration-200 flex flex-col gap-1.5 md:hidden">
          {navLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between ${
                  active
                    ? "bg-primary-soft text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <span>{l.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
