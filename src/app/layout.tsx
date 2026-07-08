import { type ReactNode } from "react";
import { Outfit, Fraunces } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Boston Abula Spot  Premium Amala & Nigerian Soups, Ordered Fresh",
  description:
    "Order authentic Amala, Ewedu & Gbegiri online. Build your custom Abula plate, pay by transfer, and track your order live.",
  authors: [{ name: "Boston Abula Spot" }],
  openGraph: {
    title: "Boston Abula Spot  Premium Amala & Nigerian Soups",
    description:
      "Build your custom Abula plate with assorted meats and sides, then track your order in real time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
