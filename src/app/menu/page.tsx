"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart-context";
import { CATEGORIES, MENU, formatNaira, type Category } from "@/lib/menu-data";

export default function MenuPage() {
  const [active, setActive] = useState<Category | "All">("All");
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const items = active === "All" ? MENU : MENU.filter((m) => m.category === active);

  const handleAdd = (id: string) => {
    const item = MENU.find((m) => m.id === id)!;
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    setJustAdded(id);
    setTimeout(() => setJustAdded((v) => (v === id ? null : v)), 900);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Our menu
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything is made fresh daily. Prices include VAT.
        </p>

        {/* Category pills */}
        <div className="sticky top-16 z-30 -mx-4 mt-6 bg-background/90 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 md:top-16">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["All", ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={
                  cat === active
                    ? "whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"
                    : "whitespace-nowrap rounded-full bg-secondary px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="relative flex flex-col rounded-3xl bg-card p-5 shadow-card transition-transform hover:-translate-y-1"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={160}
                height={160}
                className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
              />
              <h2 className="mt-4 text-sm font-semibold text-foreground">{item.name}</h2>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {formatNaira(item.price)}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  aria-label={`Add ${item.name} to cart`}
                  className={
                    justAdded === item.id
                      ? "flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-all"
                      : "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant transition-all hover:scale-110 active:scale-95"
                  }
                >
                  {justAdded === item.id ? "✓" : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
