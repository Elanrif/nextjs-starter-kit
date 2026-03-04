import { DocsSection } from "@/components/kickstart/DocsSection";
import GettingStartedSection from "@/components/kickstart/GettingStartedSection";
import CTASection from "@/components/kickstart/CTASection";
import { Footer } from "@/components/kickstart/Footer";
import { Header } from "@/components/kickstart/Header";
import Hero from "@/components/kickstart/Hero";

export const metadata = {
  title: "Nextjs Starter Kit",
  description:
    "A template for building Next.js applications with Tailwind CSS and TypeScript",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <DocsSection />
        <GettingStartedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
