import CTASection from "@/components/features/cta-section";
import { Footer } from "@/components/features/Footer";
import GettingStartedSection from "@/components/features/getting-started-section";
import { Header } from "@/components/features/header_";
import Hero from "@/components/features/Hero";

export const metadata = {
  title: "Accueil - Nextjs Starter Kit",
  description:
    "Démarrez votre projet Next.js avec une pile technologique moderne incluant l'authentification, un tableau de bord et bien plus.",
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
