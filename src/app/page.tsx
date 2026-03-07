import { DocsSection } from "@/components/kickstart/DocsSection";
import GettingStartedSection from "@/components/kickstart/GettingStartedSection";
import FeaturesSection from "@/components/kickstart/FeaturesSection";
import CTASection from "@/components/kickstart/CTASection";
import { Footer } from "@/components/kickstart/Footer";
import { Header } from "@/components/kickstart/Header";
import Hero from "@/components/kickstart/Hero";

export const metadata = {
  title: "Kickstart Next.js - Le Boilerplate Moderne",
  description:
    "Un template Next.js complet avec TypeScript, Tailwind CSS, authentification, et toutes les meilleures pratiques pour construire des applications web modernes rapidement.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
        <DocsSection />
        <GettingStartedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
