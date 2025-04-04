import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

export function Hero({
  headline = "Build your squats with Squatter.",
  subheadline = "With Squatter, you can track you workouts, monitor your weight and create individualized plans for your fitness goals.",
  primaryCTA = {
    text: "Create Your Plan",
    href: "/create-plan",
  },
  secondaryCTA = {
    text: "Track your weight",
    href: "/weight",
  },

  backgroundImage = "/placeholder.svg?height=800&width=1600",
}: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Fitness background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {headline.split(".").map((part, index) => (
                <span key={index}>
                  {part.trim()}
                  {index < headline.split(".").length - 1 && (
                    <>
                      .<br />
                    </>
                  )}
                </span>
              ))}
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href={primaryCTA.href}>
                  {primaryCTA.text}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" asChild>
                <Link href={secondaryCTA.href}>
                  {secondaryCTA.text}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative h-[400px] w-[400px] rounded-full bg-primary/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0" />

              <Image
                src="/squatter.png"
                alt="Squatter app preview"
                fill
                sizes="400px"
                priority
                className="object-cover object-center rounded-full z-10 "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
