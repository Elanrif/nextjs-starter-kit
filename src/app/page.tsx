import GettingStartedSection from "@/components/kickstart/GettingStartedSection";
import CTASection from "@/components/kickstart/CTASection";
import { Footer } from "@/components/kickstart/Footer";
import { Header } from "@/components/kickstart/Header";
import Hero from "@/components/kickstart/Hero";

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
