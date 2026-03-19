import GettingStartedSection from "@/components/features/GettingStartedSection";
import CTASection from "@/components/features/CTASection";
import { Footer } from "@/components/features/Footer";
import { Header } from "@/components/features/Header";
import Hero from "@/components/features/Hero";

export const metadata = {
  title: "Kickstart Next.js - Modern Boilerplate",
  description:
    "Kickstart your Next.js project with a modern boilerplate" +
    "featuring authentication, dashboard, and more.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <GettingStartedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
