"use client";

import { Check, ChefHat, ClipboardCheck, MapPin, Package, Bike } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { formatNaira } from "@/lib/menu-data";

interface ActiveOrder {
  id: string;
  placedAt: number;
  total: number;
}

const STEPS = [
  { label: "Order Confirmed", sub: "We've received your order", icon: ClipboardCheck },
  { label: "Kitchen Preparing", sub: "Your àbùlà is being plated fresh", icon: ChefHat },
  { label: "Packing Up", sub: "Sealed hot and bagged", icon: Package },
  { label: "Rider on the Way", sub: "Your order has left the kitchen", icon: Bike },
  { label: "Ready for Pickup", sub: "Rider is at your door", icon: MapPin },
];

// Each step advances after this many seconds (demo pacing)
const STEP_SECONDS = 25;

export default function TrackingPage() {
  const [order, setOrder] = useState<ActiveOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("abula-active-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("abula-active-order-location");
    if (savedLocation) {
      setLocation(savedLocation);
      setLocationInput(savedLocation);
    }
  }, []);

  const saveLocation = () => {
    if (locationInput.trim()) {
      localStorage.setItem("abula-active-order-location", locationInput.trim());
      setLocation(locationInput.trim());
      setIsEditingLocation(false);
    }
  };

  const elapsed = order ? Math.floor((now - order.placedAt) / 1000) : 0;
  const activeStep = order ? Math.min(Math.floor(elapsed / STEP_SECONDS), STEPS.length - 1) : 0;

  if (loaded && !order) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MapPin className="h-9 w-9" />
          </span>
          <h1 className="font-display mt-6 text-2xl font-semibold text-foreground">
            No active order
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Place an order and you'll see its live journey here.
          </p>
          <Link
            href="/menu"
            className="shadow-elegant mt-8 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Order now
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader />

      {/* Map vector backdrop */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 h-[480px] w-full opacity-[0.05]"
        viewBox="0 0 800 480"
        fill="none"
      >
        <path d="M-20 120 L280 90 L520 160 L820 110" stroke="currentColor" strokeWidth="14" />
        <path d="M120 -20 L160 200 L100 500" stroke="currentColor" strokeWidth="10" />
        <path d="M-20 320 L340 300 L640 380 L820 340" stroke="currentColor" strokeWidth="12" />
        <path d="M420 -20 L460 180 L420 500" stroke="currentColor" strokeWidth="8" />
        <path d="M640 -20 L600 240 L680 500" stroke="currentColor" strokeWidth="8" />
        <circle cx="460" cy="180" r="20" fill="currentColor" />
      </svg>

      <main className="relative mx-auto max-w-xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Live tracking</p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Order {order?.id}
            </h1>
          </div>
          {order && order.total > 0 && (
            <span className="rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              {formatNaira(order.total)}
            </span>
          )}
        </div>

        {/* ETA card */}
        <div className="mt-6 flex items-center justify-between rounded-3xl bg-primary p-6 text-primary-foreground shadow-elegant">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">Estimated arrival</p>
            <p className="font-display mt-1 text-3xl font-semibold">
              {Math.max(5, 45 - Math.floor(elapsed / 60))}–
              {Math.max(10, 50 - Math.floor(elapsed / 60))} min
            </p>
          </div>
          <Bike className="h-10 w-10 opacity-90" />
        </div>

        {/* Delivery Location Card */}
        <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="w-full">
              <p className="text-sm font-semibold text-foreground">Delivery Address</p>
              
              {!isEditingLocation && location ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">{location}</p>
                  <button
                    onClick={() => setIsEditingLocation(true)}
                    className="text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    Edit Address
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter your delivery location (e.g. Futa NorthGate, Akure)"
                    className="h-10 flex-1 rounded-full border border-input bg-transparent px-4 text-xs text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={saveLocation}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95 hover:scale-[1.02]"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <ol className="mt-8 space-y-0">
          {STEPS.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative flex gap-4 pb-10 last:pb-0">
                {/* connector */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className={
                      done
                        ? "absolute left-[23px] top-12 h-[calc(100%-3rem)] w-0.5 bg-primary"
                        : "absolute left-[23px] top-12 h-[calc(100%-3rem)] w-0.5 bg-border"
                    }
                  />
                )}
                {/* node */}
                <span
                  className={
                    active
                      ? "animate-node-glow z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : done
                        ? "z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/90 text-primary-foreground"
                        : "z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground"
                  }
                >
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <div className="pt-1.5">
                  <p
                    className={
                      active || done
                        ? "text-sm font-semibold text-foreground"
                        : "text-sm font-medium text-muted-foreground"
                    }
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.sub}</p>
                  {active && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      Happening now
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 rounded-3xl bg-secondary p-5 text-center">
          <p className="text-xs text-muted-foreground">
            Questions about your order? Call us on{" "}
            <span className="font-semibold text-foreground">0803 555 0123</span>
          </p>
        </div>
      </main>
    </div>
  );
}
