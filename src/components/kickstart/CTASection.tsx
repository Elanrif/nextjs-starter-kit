import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowRight,
  Github,
  BookOpen,
  Sparkles,
  Star,
  Database,
  Zap,
  Shield,
  Code2,
  Palette,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Performance First",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-500",
    borderColor: "border-yellow-200",
    items: [
      "Next.js 15 App Router",
      "Server Components",
      "Image Optimization",
      "Streaming & Suspense",
    ],
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Developer Experience",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-500",
    borderColor: "border-blue-200",
    items: ["TypeScript", "ESLint + Prettier", "Hot Reload", "Git Hooks"],
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Modern UI",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-500",
    borderColor: "border-purple-200",
    items: ["Tailwind CSS", "shadcn/ui", "Dark Mode", "Responsive Design"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Authentication",
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    borderColor: "border-emerald-200",
    items: [
      "JWT Sessions",
      "Protected Routes",
      "Middleware",
      "Security Headers",
    ],
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Data Management",
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-500",
    borderColor: "border-cyan-200",
    items: ["Modern ORM", "Type Safety", "Migrations", "Query Optimization"],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Production Ready",
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-500",
    borderColor: "border-rose-200",
    items: ["Vercel Deploy", "Docker Support", "CI/CD", "Analytics"],
  },
];

export default function CTASection() {
  return (
    <section className="py-10 sm:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
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
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="px-8 py-16 sm:px-16 sm:py-24 text-center">
            {/* Badge */}
            <div className="animate-fade-in-up mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  Ready to Start?
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="animate-fade-in-up animation-delay-100 text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Build Something
              <br />
              <span className="text-blue-400">Amazing</span>
            </h2>

            {/* Subtitle */}
            <p className="animate-fade-in-up animation-delay-200 mt-8 text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
              Start your next project with our template and focus on what
              matters: building products that your users will love.
            </p>

            {/* Features Grid */}
            <div className="animate-fade-in-up animation-delay-250 mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 ${feature.iconBg} rounded-lg flex items-center justify-center text-white shadow-md`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {feature.items.slice(0, 2).map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-xs text-blue-100/80 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-300 mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto mb-12">
              {[
                { number: "15+", label: "Components" },
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
                  Use This Template
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
              <span>Trusted by 1000+ developers</span>
            </div>
          </div>

          {/* Floating Rocket */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="relative">
              <Rocket className="w-20 h-20 text-white/20 animate-float" />
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
