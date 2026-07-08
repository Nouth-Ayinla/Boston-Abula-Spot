"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart-context";
import { MENU, formatNaira, images, getImgSrc } from "@/lib/menu-data";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useTransform,
  type PanInfo,
} from "framer-motion";

const orbitDishes = [
  { ...MENU.find((m) => m.id === "abula-classic")!, label: "Classic Abula", img: images.heroAmala },
  { ...MENU.find((m) => m.id === "jollof-rice")!, label: "Smoky Jollof Rice", img: images.jollof },
  { ...MENU.find((m) => m.id === "semo-efo-riro")!, label: "Semo & Efo Riro", img: images.semo },
  { ...MENU.find((m) => m.id === "assorted-meat")!, label: "Assorted Meats", img: images.assortedMeat },
  { ...MENU.find((m) => m.id === "dodo")!, label: "Fried Plantain", img: images.plantain },
  { ...MENU.find((m) => m.id === "efo-riro")!, label: "Efo Riro", img: images.efoRiro },
];

export default function Index() {
  const { addItem } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  // Angle state for the wheel rotation
  const [angle, setAngle] = useState(0);
  const rotationMotion = useMotionValue(0);
  const rotationSpring = useSpring(rotationMotion, { stiffness: 100, damping: 20 });
  const oppositeRotation = useTransform(rotationSpring, (r) => -r);

  useEffect(() => {
    rotationMotion.set(angle);
  }, [angle, rotationMotion]);

  // Autoplay slideshow for mobile carousel and desktop orbiting wheel
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % orbitDishes.length;
      const step = 360 / orbitDishes.length;
      const targetBase = -nextIndex * step;
      const diff = ((targetBase - angle + 180) % 360) - 180;
      const normalizedDiff = diff < -180 ? diff + 360 : diff;
      setAngle(angle + normalizedDiff);
      setActiveIndex(nextIndex);
    }, 8000); // cycle every 8 seconds (slower transition)

    return () => clearInterval(timer);
  }, [activeIndex, angle]);

  const handleDrag = (event: unknown, info: PanInfo) => {
    // 1px of drag in X translates to 0.4 degrees of rotation
    const newAngle = angle + info.delta.x * 0.4;
    setAngle(newAngle);
  };

  const handleDragEnd = (event: unknown, info: PanInfo) => {
    const step = 360 / orbitDishes.length;

    // Snap to the closest dish step
    const snappedAngle = Math.round(angle / step) * step;
    setAngle(snappedAngle);

    // Calculate which dish index is at the active position (top, corresponding to 0 degrees modulo 360)
    // To align the active index with top (0 degrees):
    // snappedAngle = -index * step => index = (-snappedAngle / step) % length
    let idx = Math.round(-snappedAngle / step) % orbitDishes.length;
    if (idx < 0) {
      idx += orbitDishes.length;
    }
    setActiveIndex(idx);
  };

  const selectDish = (index: number) => {
    const step = 360 / orbitDishes.length;

    // Find the shortest rotation path to the target index
    // Current angle is at setAngle. We want: -index * step + k * 360 to be closest to current angle.
    const targetBase = -index * step;
    const currentAngle = angle;
    const diff = ((targetBase - currentAngle + 180) % 360) - 180;
    const normalizedDiff = diff < -180 ? diff + 360 : diff;

    const targetAngle = currentAngle + normalizedDiff;
    setAngle(targetAngle);
    setActiveIndex(index);
  };

  const activeDish = orbitDishes[activeIndex];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Curved light red backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[30%] -top-[40%] hidden h-[160%] w-[75%] rounded-full bg-primary-soft lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[18%] -top-[25%] hidden h-[120%] w-[55%] rounded-full bg-accent lg:block"
          />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:py-24">
            {/* Left copy */}
            <div className="relative z-10 text-center lg:text-left min-h-[420px] flex flex-col justify-center">
              <span className="self-center lg:self-start inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                <Star className="h-3.5 w-3.5 fill-current" /> Boston's finest Abula
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDish.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {activeDish.name}
                    <br />
                    <em className="text-primary font-serif">served hot.</em>
                  </h1>

                  {/* Mobile-only active dish image */}
                  <div className="my-6 flex justify-center lg:hidden">
                    <img
                      src={getImgSrc(activeDish.image)}
                      alt={activeDish.name}
                      width={300}
                      height={300}
                      className="h-52 w-52 object-contain drop-shadow-xl animate-float-gentle"
                      draggable={false}
                    />
                  </div>

                  <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0">
                    {activeDish.description}. Made fresh every morning with selected local
                    ingredients and delivered in under 45 minutes.
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Dots Carousel Indicator */}
              <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
                {orbitDishes.map((_, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveIndex(i);
                        const step = 360 / orbitDishes.length;
                        setAngle(-i * step);
                      }}
                      className={`h-2.5 transition-all rounded-full ${isActive ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground"
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <button
                  onClick={() =>
                    addItem({
                      id: activeDish.id,
                      name: activeDish.name,
                      price: activeDish.price,
                      image: activeDish.image,
                    })
                  }
                  className="shadow-elegant inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  Add to Cart {formatNaira(activeDish.price)}
                </button>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" /> Build your own plate
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center gap-8 text-left lg:justify-start">
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">45min</p>
                  <p className="text-xs text-muted-foreground">avg. delivery</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">4.9★</p>
                  <p className="text-xs text-muted-foreground">2,400+ reviews</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-2xl font-semibold text-foreground">Daily</p>
                  <p className="text-xs text-muted-foreground">fresh soups</p>
                </div>
              </div>
            </div>

            {/* Right: bowl + interactive orbiting carousel (Desktop only) */}
            <div className="hidden lg:flex orbit-container relative z-10 mx-auto aspect-square w-full max-w-[280px] sm:max-w-[360px] md:max-w-[400px] items-center justify-center overflow-visible select-none">
              {/* Circular draggable drag target area */}
              <motion.div
                drag="x"
                dragElastic={0.1}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing rounded-full"
                style={{ touchAction: "none" }}
              />

              {/* Dashed track */}
              <div
                aria-hidden
                className="absolute rounded-full border-2 border-dashed border-primary/30"
                style={{
                  width: "var(--track-size)",
                  height: "var(--track-size)",
                }}
              />

              {/* Orbiting plates */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ rotate: rotationSpring }}
              >
                {orbitDishes.map((d, i) => {
                  const angleOffset = (i / orbitDishes.length) * 360;
                  const isActive = i === activeIndex;

                  return (
                    <div
                      key={d.id}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `rotate(${angleOffset}deg) translateY(calc(-50% - 0px)) translate(0, var(--orbit-radius))`,
                      }}
                    >
                      <motion.div
                        onClick={() => selectDish(i)}
                        className={`pointer-events-auto cursor-pointer rounded-full bg-background p-1 shadow-card transition-shadow hover:shadow-elegant ${isActive ? "ring-4 ring-primary ring-offset-2 scale-110" : ""
                          }`}
                        style={{
                          width: "var(--plate-size)",
                          height: "var(--plate-size)",
                        }}
                        animate={{
                          scale: isActive ? 1.15 : 1.0,
                        }}
                        whileHover={{ scale: isActive ? 1.2 : 1.08 }}
                      >
                        {/* Opposite rotation to keep images upright */}
                        <motion.div
                          className="h-full w-full"
                          style={{
                            rotate: oppositeRotation,
                          }}
                        >
                          <div
                            className="h-full w-full"
                            style={{ transform: `rotate(${-angleOffset}deg)` }}
                          >
                            <img
                              src={getImgSrc(d.image)}
                              alt={d.name}
                              width={160}
                              height={160}
                              className="h-full w-full rounded-full object-cover"
                              draggable={false}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Center bowl */}
              <div className="pointer-events-none relative w-[68%] z-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDish.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className="w-full flex items-center justify-center"
                  >
                    <img
                      src={getImgSrc(activeDish.image)}
                      alt={activeDish.name}
                      width={512}
                      height={512}
                      className="w-full drop-shadow-2xl object-contain aspect-square"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Crowd Favorites Section */}
        <section className="border-t border-border/60 bg-secondary/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Crowd favourites
              </h2>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Full menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {MENU.filter((item) => ["abula-classic", "jollof-rice", "semo-efo-riro", "efo-riro"].includes(item.id)).map((item) => (
                <Link
                  key={item.id}
                  href="/menu"
                  className="group rounded-3xl bg-card p-5 text-center shadow-card transition-transform hover:-translate-y-1"
                >
                  <img
                    src={getImgSrc(item.image)}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="mx-auto h-24 w-24 object-contain transition-transform group-hover:scale-105"
                    draggable={false}
                  />
                  <p className="mt-3 text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm font-medium text-primary">{formatNaira(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <p className="font-display text-lg font-semibold text-foreground">
            Boston Abula Spot<span className="text-primary">.</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Fresh Abula, made daily in Boston, Futa NorthGate, Akure,Ondo ,Nigeria· Open 9am – 9pm
          </p>
        </div>
      </footer>
    </div>
  );
}
