"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart-context";
import { formatNaira, images } from "@/lib/menu-data";

const swallows = [
  { id: "amala", name: "Amala", price: 500, image: images.amalaBuilder },
  { id: "pounded-yam", name: "Pounded Yam", price: 600, image: images.poundedYam },
  { id: "eba", name: "Eba", price: 400, image: images.ebaWrap },
  { id: "semo-swallow", name: "Semolina", price: 500, image: images.semoWrap },
] as const;

const soups = [
  { id: "ewedu-gbegiri", name: "Ewedu + Gbegiri", price: 0, image: images.ewedu },
  { id: "egusi", name: "Egusi", price: 0, image: images.egusi },
  { id: "efo-riro", name: "Efo Riro", price: 0, image: images.efoRiro },
] as const;

const proteins = [
  { id: "beef", name: "Beef", price: 500 },
  { id: "shaki", name: "Shaki", price: 500 },
  { id: "ponmo", name: "Ponmo", price: 400 },
  { id: "goat-meat", name: "Goat Meat", price: 800 },
  { id: "smoked-fish", name: "Smoked Fish", price: 900 },
  { id: "boiled-egg", name: "Boiled Egg", price: 300 },
] as const;

const sides = [
  { id: "dodo", name: "Fried Plantain", price: 1200, image: images.plantain },
] as const;

export default function BuilderPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [swallow, setSwallow] = useState<string>("amala");
  const [swallowWraps, setSwallowWraps] = useState(2);
  const [soup, setSoup] = useState<string>("ewedu-gbegiri");
  const [proteinCounts, setProteinCounts] = useState<Record<string, number>>({ beef: 1 });
  const [sideCounts, setSideCounts] = useState<Record<string, number>>({});

  const total = useMemo(() => {
    const sw = swallows.find((s) => s.id === swallow)!;
    const sp = soups.find((s) => s.id === soup)!;
    const proteinTotal = proteins.reduce((s, p) => s + (proteinCounts[p.id] ?? 0) * p.price, 0);
    const sideTotal = sides.reduce((s, p) => s + (sideCounts[p.id] ?? 0) * p.price, 0);
    return sw.price * swallowWraps + sp.price + proteinTotal + sideTotal;
  }, [swallow, swallowWraps, soup, proteinCounts, sideCounts]);

  const bump = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    id: string,
    delta: number,
  ) =>
    setter((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));

  const handleAdd = () => {
    const sw = swallows.find((s) => s.id === swallow)!;
    const sp = soups.find((s) => s.id === soup)!;
    const chosenProteins = proteins
      .filter((p) => (proteinCounts[p.id] ?? 0) > 0)
      .map((p) => `${p.name} ×${proteinCounts[p.id]}`);
    const chosenSides = sides
      .filter((p) => (sideCounts[p.id] ?? 0) > 0)
      .map((p) => `${p.name} ×${sideCounts[p.id]}`);
    const note = [`${sw.name} ×${swallowWraps}`, sp.name, ...chosenProteins, ...chosenSides].join(
      " · ",
    );

    addItem(
      {
        id: `custom-${Date.now()}`,
        name: "Custom Abula Plate",
        price: total,
        image: images.heroAmala,
        note,
      },
      1,
    );
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-secondary/40 pb-32">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Build your plate
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Three steps to your perfect àbùlà. Prices update live.
        </p>

        {/* Step 1: Swallow */}
        <section className="mt-8 rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </span>
            <h2 className="text-base font-semibold text-foreground">Choose your swallow</h2>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {swallows.map((s) => {
              const selected = swallow === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSwallow(s.id)}
                  className={
                    selected
                      ? "relative rounded-2xl border-2 border-primary bg-primary-soft p-4 text-center transition-all"
                      : "relative rounded-2xl border-2 border-border p-4 text-center transition-all hover:border-primary/40"
                  }
                >
                  {selected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <Image
                    src={s.image}
                    alt={s.name}
                    width={160}
                    height={160}
                    className="mx-auto h-14 w-14 rounded-full object-cover"
                  />
                  <p className="mt-2 text-xs font-semibold text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatNaira(s.price)}/wrap</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
            <span className="text-sm font-medium text-foreground">Wraps</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSwallowWraps((w) => Math.max(1, w - 1))}
                aria-label="Fewer wraps"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-card"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-5 text-center text-sm font-semibold text-foreground">
                {swallowWraps}
              </span>
              <button
                onClick={() => setSwallowWraps((w) => w + 1)}
                aria-label="More wraps"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Soup */}
        <section className="mt-5 rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </span>
            <h2 className="text-base font-semibold text-foreground">Pick your soup</h2>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {soups.map((s) => {
              const selected = soup === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSoup(s.id)}
                  className={
                    selected
                      ? "relative rounded-2xl border-2 border-primary bg-primary-soft p-4 text-center transition-all"
                      : "relative rounded-2xl border-2 border-border p-4 text-center transition-all hover:border-primary/40"
                  }
                >
                  {selected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <Image
                    src={s.image}
                    alt={s.name}
                    width={160}
                    height={160}
                    className="mx-auto h-14 w-14 rounded-full object-cover"
                  />
                  <p className="mt-2 text-xs font-semibold text-foreground">{s.name}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Proteins */}
        <section className="mt-5 rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </span>
            <h2 className="text-base font-semibold text-foreground">Add your proteins</h2>
          </div>
          <div className="mt-5 space-y-3">
            {proteins.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNaira(p.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => bump(setProteinCounts, p.id, -1)}
                    aria-label={`Remove one ${p.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-foreground">
                    {proteinCounts[p.id] ?? 0}
                  </span>
                  <button
                    onClick={() => bump(setProteinCounts, p.id, 1)}
                    aria-label={`Add one ${p.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 4: Sides */}
        <section className="mt-5 rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              4
            </span>
            <h2 className="text-base font-semibold text-foreground">Any sides?</h2>
          </div>
          <div className="mt-5 space-y-3">
            {sides.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNaira(p.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => bump(setSideCounts, p.id, -1)}
                    aria-label={`Remove one ${p.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-foreground">
                    {sideCounts[p.id] ?? 0}
                  </span>
                  <button
                    onClick={() => bump(setSideCounts, p.id, 1)}
                    aria-label={`Add one ${p.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-xl">
          <button
            onClick={handleAdd}
            className="shadow-elegant flex w-full items-center justify-between rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Add Custom Plate</span>
            <span className="font-display text-base">{formatNaira(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
