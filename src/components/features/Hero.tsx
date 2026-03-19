import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ArrowRight, Sparkles, Zap, Code, Rocket } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-16 sm:py-32 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900" />

        {/* Animated Mesh Pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="gradient2" cx="30%" cy="70%" r="40%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <ellipse
              cx="50"
              cy="30"
              rx="25"
              ry="20"
              fill="url(#gradient1)"
              className="animate-pulse"
            />
            <ellipse
              cx="80"
              cy="70"
              rx="20"
              ry="15"
              fill="url(#gradient2)"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <ellipse
              cx="20"
              cy="60"
              rx="15"
              ry="25"
              fill="url(#gradient1)"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <Badge className="mb-8 px-6 py-2 text-sm font-medium bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-semibold">
                Next.js 15 + React 19 + TypeScript + Tailwind CSS
              </span>
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up animation-delay-100 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="block text-white mb-2">Build Amazing</span>
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Web Apps Fast
            </span>
          </h1>

          {/* Subtitle */}
          <p className="px-5 sm:px-10 text-sm sm:text-lg animate-fade-in-up animation-delay-200 mx-auto mt-8 max-w-3xl leading-relaxed text-blue-100/90 mb-12">
            Kickstart your Next.js project with a modern boilerplate featuring
            basic authentication with JOE, dashboard, and more. Focus on
            building your product, not the setup.
          </p>

          {/* Feature Pills */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: <Zap className="w-4 h-4" />, text: "Performance" },
              { icon: <Code className="w-4 h-4" />, text: "TypeScript" },
              { icon: <Sparkles className="w-4 h-4" />, text: "Modern UI" },
              {
                icon: <Rocket className="w-4 h-4" />,
                text: "Production Ready",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <span className="text-blue-300">{item.icon}</span>
                <span className="text-white/90 text-sm font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="group px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a
                href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Voir le code
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-500 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Composants", color: "text-blue-300" },
              { number: "100%", label: "TypeScript", color: "text-purple-300" },
              { number: "0", label: "Configuration", color: "text-pink-300" },
              { number: "∞", label: "Possibilités", color: "text-cyan-300" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}
                >
                  {stat.number}
                </div>
                <div className="text-blue-100/80 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
