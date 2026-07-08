"use client";

import { Check, ChefHat, ClipboardCheck, MapPin, Package, Bike, Printer, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { formatNaira } from "@/lib/menu-data";

interface ActiveOrder {
  id: string;
  placedAt: number;
  total: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  items?: any[];
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
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

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

  const handlePrintReceipt = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #1f2937; max-width: 380px; margin: 0 auto; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px dashed #e5e7eb; padding-bottom: 16px; margin-bottom: 16px; }
            .logo { font-size: 20px; font-weight: 800; color: #dc2626; }
            .meta { margin: 16px 0; font-size: 13px; color: #4b5563; }
            .meta div { margin-bottom: 4px; }
            .items { width: 100%; border-bottom: 2px dashed #e5e7eb; padding-bottom: 16px; margin-bottom: 16px; }
            .item-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; font-weight: 500; }
            .item-note { font-size: 11px; color: #6b7280; margin-top: -6px; margin-bottom: 8px; padding-left: 8px; }
            .summary { font-size: 13px; color: #4b5563; }
            .summary-row { display: flex; justify-content: space-between; margin: 6px 0; }
            .total { font-size: 16px; font-weight: 700; color: #111827; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
            .footer { text-align: center; margin-top: 32px; font-size: 11px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Boston Abula Spot.</div>
            <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Futa NorthGate, Akure, Ondo, Nigeria</div>
          </div>
          <div class="meta">
            <div><strong>Order ID:</strong> ${order.id}</div>
            <div><strong>Date:</strong> ${new Date(order.placedAt).toLocaleString()}</div>
            ${location ? `<div><strong>Delivery Address:</strong> ${location}</div>` : ""}
          </div>
          <div class="items">
            ${(order.items || [])
              .map(
                (item: any) => `
              <div>
                <div class="item-row">
                  <span>${item.name} x${item.qty}</span>
                  <span>₦${(item.price * item.qty).toLocaleString("en-NG")}</span>
                </div>
                ${item.note ? `<div class="item-note">${item.note}</div>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₦${(order.subtotal || order.total).toLocaleString("en-NG")}</span>
            </div>
            ${
              order.discount
                ? `
            <div class="summary-row">
              <span>Discount</span>
              <span>-₦${order.discount.toLocaleString("en-NG")}</span>
            </div>
            `
                : ""
            }
            <div class="summary-row">
              <span>Delivery Fee</span>
              <span>₦${(order.delivery || 0).toLocaleString("en-NG")}</span>
            </div>
            <div class="summary-row total">
              <span>Total Paid</span>
              <span>₦${order.total.toLocaleString("en-NG")}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your business! Enjoy your àbùlà.</p>
            <p>Powered by Boston Abula Spot</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
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

        {/* Order Receipt Card */}
        <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Printer className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Order Receipt</p>
              <p className="text-xs text-muted-foreground">Print or download PDF invoice</p>
            </div>
          </div>
          <button
            onClick={() => setIsReceiptOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>View Receipt</span>
          </button>
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

      {/* Modern, Styled Thermal-Style Receipt Modal */}
      {isReceiptOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-background p-6 shadow-elegant border border-border animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsReceiptOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Receipt Preview */}
            <div
              id="receipt-print-area"
              className="mt-4 border-2 border-dashed border-border bg-card p-5 rounded-2xl"
            >
              <div className="text-center border-b border-border/80 pb-4 mb-4">
                <h3 className="font-display text-lg font-bold text-primary">Boston Abula Spot</h3>
                <p className="text-[10px] text-muted-foreground">
                  Futa NorthGate, Akure, Ondo, Nigeria
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground border-b border-border/80 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-semibold text-foreground">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-foreground">
                    {new Date(order.placedAt).toLocaleString()}
                  </span>
                </div>
                {location && (
                  <div className="flex justify-between">
                    <span>Delivery To:</span>
                    <span
                      className="text-foreground text-right truncate max-w-[180px]"
                      title={location}
                    >
                      {location}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-b border-border/80 pb-4 mb-4">
                {(order.items || []).map((item: any, i: number) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-foreground">
                        {item.name} ×{item.qty}
                      </span>
                      <span className="text-foreground font-semibold">
                        {formatNaira(item.price * item.qty)}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 italic pl-2 border-l border-border">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatNaira(order.subtotal || order.total)}</span>
                </div>
                {order.discount ? (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span>-{formatNaira(order.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{formatNaira(order.delivery || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground border-t border-dashed border-border pt-3 mt-3">
                  <span>Total Paid</span>
                  <span className="text-primary">{formatNaira(order.total)}</span>
                </div>
              </div>

              {/* Barcode SVG */}
              <div className="flex flex-col items-center justify-center mt-6 opacity-85">
                <svg width="140" height="32" className="text-foreground">
                  <rect x="0" width="2" height="32" fill="currentColor" />
                  <rect x="4" width="1" height="32" fill="currentColor" />
                  <rect x="6" width="3" height="32" fill="currentColor" />
                  <rect x="11" width="1" height="32" fill="currentColor" />
                  <rect x="14" width="2" height="32" fill="currentColor" />
                  <rect x="18" width="4" height="32" fill="currentColor" />
                  <rect x="23" width="1" height="32" fill="currentColor" />
                  <rect x="26" width="3" height="32" fill="currentColor" />
                  <rect x="30" width="2" height="32" fill="currentColor" />
                  <rect x="34" width="1" height="32" fill="currentColor" />
                  <rect x="37" width="3" height="32" fill="currentColor" />
                  <rect x="42" width="4" height="32" fill="currentColor" />
                  <rect x="47" width="1" height="32" fill="currentColor" />
                  <rect x="50" width="2" height="32" fill="currentColor" />
                  <rect x="54" width="3" height="32" fill="currentColor" />
                  <rect x="58" width="1" height="32" fill="currentColor" />
                  <rect x="61" width="4" height="32" fill="currentColor" />
                  <rect x="67" width="2" height="32" fill="currentColor" />
                  <rect x="70" width="1" height="32" fill="currentColor" />
                  <rect x="73" width="3" height="32" fill="currentColor" />
                  <rect x="78" width="2" height="32" fill="currentColor" />
                  <rect x="81" width="4" height="32" fill="currentColor" />
                  <rect x="87" width="1" height="32" fill="currentColor" />
                  <rect x="90" width="3" height="32" fill="currentColor" />
                  <rect x="95" width="2" height="32" fill="currentColor" />
                  <rect x="98" width="1" height="32" fill="currentColor" />
                  <rect x="101" width="4" height="32" fill="currentColor" />
                  <rect x="107" width="2" height="32" fill="currentColor" />
                  <rect x="110" width="1" height="32" fill="currentColor" />
                  <rect x="113" width="3" height="32" fill="currentColor" />
                  <rect x="118" width="4" height="32" fill="currentColor" />
                  <rect x="124" width="1" height="32" fill="currentColor" />
                  <rect x="127" width="2" height="32" fill="currentColor" />
                  <rect x="131" width="3" height="32" fill="currentColor" />
                  <rect x="136" width="2" height="32" fill="currentColor" />
                </svg>
                <span className="font-mono text-[9px] text-muted-foreground letter-spacing-1 mt-1">
                  *{order.id}*
                </span>
              </div>
            </div>

            {/* Print Button inside Modal */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="flex-1 rounded-full border border-border py-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 shadow-elegant rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
