"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSplitDemo } from "@/components/hero-split-demo";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Drop a wide image",
    description: "Landscape images work best.",
  },
  {
    number: "02",
    title: "Choose your cuts",
    description: "Split it into 2, 3, or 4 equal slides.",
  },
  {
    number: "03",
    title: "Post in order",
    description: "Upload the slides in order and X shows them as one picture.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16">
          <h1 className="text-4xl font-medium leading-[1.25] tracking-tight sm:text-5xl">
            Ride the trend.
            <br />
            Post your hat-trick.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Turn one wide image into 2, 3, or 4 seamless slides for X.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/editor">Make your slideshow</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
          <HeroSplitDemo />
        </section>

        <section className="border-t border-border/60">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-3 sm:gap-12 sm:px-6 sm:py-20">
            {STEPS.map((step) => (
              <div key={step.number} className="space-y-3">
                <span className="text-sm font-medium text-muted-foreground/60">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
