import React from "react"
import { RevealSection } from "@/components/edu/reveal-section"
import { HeroSection } from "./_components/hero-section"
import { QuickAccessSection } from "./_components/quick-access-section"
import { SectionGrid } from "./_components/section-grid"
import { ConsistencySection } from "./_components/consistency-section"
import { FooterSection } from "./_components/footer-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-edu-bg flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <RevealSection>
          <QuickAccessSection />
        </RevealSection>
        <hr className="edu-divider mx-auto max-w-5xl" />
        <SectionGrid />
        <hr className="edu-divider mx-auto max-w-5xl" />
        <ConsistencySection />
      </main>
      <FooterSection />
    </div>
  )
}
