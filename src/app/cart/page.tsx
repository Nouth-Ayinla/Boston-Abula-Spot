"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/menu-data";

const DELIVERY_FEE = 1000;
const COUPONS: Record<string, number> = { ABULA10: 0.1, FIRSTBITE: 0.15 };

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discount = appliedCoupon ? Math.round(subtotal * COUPONS[appliedCoupon]) : 0;
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal - discount + delivery;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponError("That code isn't valid. Try ABULA10.");
    }
  };

  const checkout = () => {
    localStorage.setItem(
      "abula-pending-order",
      JSON.stringify({
        items,
        subtotal,
        discount,
        delivery,
        total,
        coupon: appliedCoupon,
      }),
    );
    router.push("/payment");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag className="h-9 w-9" />
          </span>
          <h1 className="font-display mt-6 text-2xl font-semibold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hungry? The àbùlà is hot and the meats are plenty.
          </p>
          <Link
            href="/menu"
            className="shadow-elegant mt-8 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Browse the menu
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40 pb-32">
      <SiteHeader />

      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Your cart
        </h1>

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-card"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={160}
                  height={160}
                  className="h-16 w-16 shrink-0 rounded-2xl object-contain"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                {item.note && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                    {item.note}
                  </p>
                )}
                <p className="mt-1 text-sm font-medium text-primary">{formatNaira(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-border"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-foreground">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="mt-6 rounded-3xl bg-card p-5 shadow-card">
          <p className="text-sm font-semibold text-foreground">Coupon code</p>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-input px-4 py-1">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="e.g. ABULA10"
              className="h-10 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={applyCoupon}
              className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <p className="mt-2 text-xs font-medium text-accent-foreground">
              ✓ {appliedCoupon} applied you saved {formatNaira(discount)}
            </p>
          )}
          {couponError && <p className="mt-2 text-xs text-destructive">{couponError}</p>}
        </div>

        {/* Totals */}
        <div className="mt-6 rounded-3xl bg-card p-5 shadow-card">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium text-foreground">{formatNaira(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="font-medium text-primary">−{formatNaira(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-medium text-foreground">{formatNaira(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="text-base font-semibold text-foreground">Total</dt>
              <dd className="font-display text-lg font-semibold text-foreground">
                {formatNaira(total)}
              </dd>
            </div>
          </dl>
        </div>
      </main>

      {/* Sticky checkout */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-xl">
          <button
            onClick={checkout}
            className="shadow-elegant flex w-full items-center justify-between rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Proceed to Checkout</span>
            <span className="font-display text-base">{formatNaira(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
