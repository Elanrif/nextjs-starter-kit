import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  Github,
  BookOpen,
  Sparkles,
  Star,
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
        <div
          className="absolute top-3/4 right-1/6 w-1 h-1 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
          <div className="px-8 py-16 sm:px-16 sm:py-24 text-center">
            {/* Badge */}
            <div className="animate-fade-in-up mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  Prêt à démarrer ?
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="animate-fade-in-up animation-delay-100 text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Construisez quelque chose
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                d'extraordinaire
              </span>
            </h2>

            {/* Subtitle */}
            <p className="animate-fade-in-up animation-delay-200 mt-8 text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
              Commencez votre prochain projet avec notre template et
              concentrez-vous sur l'essentiel : créer des produits que vos
              utilisateurs vont adorer.
            </p>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-300 mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto mb-12">
              {[
                { number: "15+", label: "Composants" },
                { number: "100%", label: "TypeScript" },
                { number: "0", label: "Configuration" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-blue-200/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="group px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl shadow-black/20 font-semibold hover:scale-105 transition-all duration-300"
                asChild
              >
                <a
                  href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-3 h-5 w-5" />
                  Utiliser ce Template
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="#docs" className="flex items-center">
                  <BookOpen className="mr-3 h-5 w-5" />
                  Documentation
                </a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="animate-fade-in-up animation-delay-500 mt-12 flex items-center justify-center gap-2 text-blue-200/80 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Rejoint par 1000+ développeurs</span>
            </div>
          </div>

          {/* Floating Rocket */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="relative">
              <Rocket className="w-20 h-20 text-white/20 animate-float" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
