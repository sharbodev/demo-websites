"use client";

import { ParticleHero } from '@/components/ui/animated-hero';

// Demo Component Page
export default function ParticleHeroDemo() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <ParticleHero
        title="MINIMAL"
        subtitle="Clean Design"
        description="Less is more with this streamlined approach."
        particleCount={10}
        interactiveHint="Hover to Interact"
        primaryButton={{
          text: "Get Started",
          onClick: () => console.log("Started!")
        }}
      />
    </div>
  );
}
