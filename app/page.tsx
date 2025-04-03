import { Hero } from "@/components/hero";

import { PlanPreview } from "@/components/plan-preview";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Hero />

      <PlanPreview />
    </div>
  );
}
