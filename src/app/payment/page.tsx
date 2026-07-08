"use client";

import { ArrowLeft, Banknote, Check, Copy, Info } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/menu-data";

interface PendingOrder {
  total: number;
  subtotal: number;
  discount: number;
  delivery: number;
  items: any[];
}

const BANK = {
  bank: "Guaranty Trust Bank (GTB)",
  accountName: "Boston Abula Spot Ltd",
  accountNumber: "0123456789",
};

export default function PaymentPage() {
  const router = useRouter();
  const { clear } = useCart();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("abula-pending-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const confirmOrder = () => {
    const orderId = `AB-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(
      "abula-active-order",
      JSON.stringify({
        id: orderId,
        placedAt: Date.now(),
        total: order?.total ?? 0,
        subtotal: order?.subtotal ?? 0,
        discount: order?.discount ?? 0,
        delivery: order?.delivery ?? 0,
        items: order?.items ?? [],
      }),
    );
    localStorage.removeItem("abula-pending-order");
    clear();
    router.push("/tracking");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Light red header bar */}
      <header className="bg-primary">
        <div className="mx-auto flex h-16 max-w-xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/cart"
            aria-label="Back to cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <h1 className="text-base font-semibold text-primary-foreground">Payment</h1>
          {order && (
            <span className="ml-auto font-display text-lg font-semibold text-primary-foreground">
              {formatNaira(order.total)}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        {loaded && !order && (
          <div className="rounded-3xl bg-secondary p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No pending order found.{" "}
              <Link href="/menu" className="font-semibold text-primary hover:underline">
                Browse the menu
              </Link>{" "}
              to get started.
            </p>
          </div>
        )}

        {/* Instruction alert */}
        <div className="flex items-start gap-3 rounded-3xl bg-primary-soft p-5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Info className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-accent-foreground">
              Pay via Transfer or Card on Delivery
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Transfer the exact total to the account below, then confirm your order. Prefer card?
              Our rider carries a POS select confirm and pay at your door.
            </p>
          </div>
        </div>

        {/* Bank details card */}
        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Banknote className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Bank transfer
              </p>
              <p className="text-sm font-semibold text-foreground">{BANK.bank}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-xs text-muted-foreground">Account name</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{BANK.accountName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Account number</dt>
              <dd className="mt-1 flex items-center justify-between gap-3">
                <span className="font-display text-2xl font-semibold tracking-wide text-foreground">
                  {BANK.accountNumber}
                </span>
                <button
                  onClick={copyAccount}
                  className={
                    copied
                      ? "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all"
                      : "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elegant transition-all hover:scale-105"
                  }
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Account"}
                </button>
              </dd>
            </div>
            {order && (
              <div>
                <dt className="text-xs text-muted-foreground">Amount to transfer</dt>
                <dd className="mt-0.5 text-sm font-semibold text-primary">
                  {formatNaira(order.total)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
          Use your phone number as the transfer reference so we can match your payment quickly.
        </p>
      </main>

      {/* Sticky confirm */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-xl">
          <button
            onClick={confirmOrder}
            disabled={!order}
            className="shadow-elegant w-full rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            I've Sent the Transfer Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
