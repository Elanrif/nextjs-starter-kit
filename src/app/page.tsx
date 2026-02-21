import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocsSection } from "@/components/DocsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description:
      "Built on Next.js 15 with Turbopack for incredibly fast development and production builds.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: "🎨",
    title: "Beautiful UI",
    description:
      "Pre-configured with Tailwind CSS and shadcn/ui for stunning, accessible components.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: "🔒",
    title: "Type Safe",
    description:
      "Full TypeScript support with strict mode enabled for better developer experience.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: "📦",
    title: "Production Ready",
    description:
      "ESLint, Prettier, Husky, and Commitlint configured for professional development.",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: "🚀",
    title: "Easy Deploy",
    description:
      "One-click deployment to Vercel with automatic CI/CD and preview environments.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: "🔧",
    title: "Developer Tools",
    description:
      "Lint-staged, pre-commit hooks, and conventional commits for clean code.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
  },
];

const techStack = [
  {
    name: "Next.js 15",
    icon: "/nextjs.svg",
    color: "hover:shadow-gray-500/20",
  },
  { name: "React 19", icon: "/react.svg", color: "hover:shadow-cyan-500/20" },
  {
    name: "TypeScript",
    icon: "/typescript.svg",
    color: "hover:shadow-blue-500/20",
  },
  {
    name: "Tailwind CSS",
    icon: "/tailwind.svg",
    color: "hover:shadow-sky-500/20",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-pink-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-linear-to-r from-violet-600/30 to-pink-600/30 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-150 h-150 bg-linear-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl opacity-20" />
            <div className="absolute top-1/2 left-0 w-100 h-100 bg-linear-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl opacity-20" />
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 animate-float opacity-60">
              <Image
                src="/hero-code.svg"
                alt=""
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
            </div>
            <div className="absolute top-40 right-20 w-16 h-16 animate-float animation-delay-200 opacity-60">
              <Image
                src="/rocket.svg"
                alt=""
                width={64}
                height={64}
                className="drop-shadow-lg"
              />
            </div>
            <div className="absolute bottom-40 left-1/4 w-12 h-12 animate-float animation-delay-400 opacity-40">
              <div className="w-full h-full rounded-full bg-linear-to-r from-yellow-400 to-orange-500 blur-sm" />
            </div>
            <div className="absolute top-1/3 right-1/4 w-8 h-8 animate-float animation-delay-300 opacity-50">
              <div className="w-full h-full rounded-lg bg-linear-to-r from-pink-400 to-rose-500 rotate-45" />
            </div>
            <div className="absolute bottom-1/4 right-10 w-10 h-10 animate-float animation-delay-500 opacity-40">
              <div className="w-full h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500" />
            </div>
            <div className="absolute top-2/3 left-20 w-6 h-6 animate-float animation-delay-100 opacity-50">
              <div className="w-full h-full rounded-full bg-linear-to-r from-emerald-400 to-green-500" />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className="mb-6 px-4 py-1.5 text-sm font-medium bg-linear-to-r from-violet-500/10 to-pink-500/10 border-violet-500/20"
                >
                  <span className="bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                    ✨ Next.js 15 + React 19 + Tailwind CSS 4
                  </span>
                </Badge>
              </div>

              {/* Heading */}
              <h1 className="animate-fade-in-up animation-delay-100 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Build faster with
                <span className="block bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                  Next.js Kickstart
                </span>
              </h1>

              {/* Description */}
              <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                A production-ready template with everything you need to build
                modern web applications. TypeScript, Tailwind CSS, shadcn/ui,
                ESLint, Prettier, and more — all pre-configured and ready to go.
              </p>

              {/* CTA Buttons */}
              <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto group" asChild>
                  <Link href="#getting-started">
                    Get Started
                    <svg
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a
                    href="https://github.com/Elanrif/kickstart-nextjs-template"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub
                  </a>
                </Button>
              </div>

              {/* Hero Image */}
              <div className="animate-fade-in-up animation-delay-400 mt-16 sm:mt-20">
                <div className="relative mx-auto max-w-4xl">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-linear-to-r from-violet-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl blur-2xl opacity-60 animate-pulse-glow" />
                  <div className="absolute -inset-1 bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 rounded-xl opacity-20" />

                  <div className="relative rounded-xl border border-white/10 bg-gray-950 p-2 shadow-2xl">
                    {/* Window controls */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-md">
                          src/app/page.tsx
                        </span>
                      </div>
                    </div>

                    {/* Code content */}
                    <div className="p-6 font-mono text-sm text-left overflow-x-auto bg-linear-to-br from-gray-950 to-gray-900">
                      <pre className="text-gray-300">
                        <code>
                          <span className="text-gray-500">1 </span>
                          <span className="text-pink-400">import</span>
                          <span className="text-white"> {"{"} </span>
                          <span className="text-cyan-400">Button</span>
                          <span className="text-white"> {"}"} </span>
                          <span className="text-pink-400">from</span>
                          <span className="text-emerald-400">
                            {" "}
                            &quot;@/components/ui&quot;
                          </span>
                          {"\n"}
                          <span className="text-gray-500">2 </span>
                          {"\n"}
                          <span className="text-gray-500">3 </span>
                          <span className="text-purple-400">
                            export default
                          </span>
                          <span className="text-blue-400"> function</span>
                          <span className="text-yellow-400"> Home</span>
                          <span className="text-white">() </span>
                          <span className="text-white">{"{"}</span>
                          {"\n"}
                          <span className="text-gray-500">4 </span>
                          <span className="text-white"> </span>
                          <span className="text-purple-400">return</span>
                          <span className="text-white"> (</span>
                          {"\n"}
                          <span className="text-gray-500">5 </span>
                          <span className="text-white"> </span>
                          <span className="text-gray-400">&lt;</span>
                          <span className="text-emerald-400">main</span>
                          <span className="text-cyan-400"> className</span>
                          <span className="text-white">=</span>
                          <span className="text-orange-400">
                            &quot;container&quot;
                          </span>
                          <span className="text-gray-400">&gt;</span>
                          {"\n"}
                          <span className="text-gray-500">6 </span>
                          <span className="text-white"> </span>
                          <span className="text-gray-400">&lt;</span>
                          <span className="text-yellow-400">Button</span>
                          <span className="text-gray-400">&gt;</span>
                          <span className="text-white">Get Started</span>
                          <span className="text-gray-400">&lt;/</span>
                          <span className="text-yellow-400">Button</span>
                          <span className="text-gray-400">&gt;</span>
                          {"\n"}
                          <span className="text-gray-500">7 </span>
                          <span className="text-white"> </span>
                          <span className="text-gray-400">&lt;/</span>
                          <span className="text-emerald-400">main</span>
                          <span className="text-gray-400">&gt;</span>
                          {"\n"}
                          <span className="text-gray-500">8 </span>
                          <span className="text-white"> )</span>
                          {"\n"}
                          <span className="text-gray-500">9 </span>
                          <span className="text-white">{"}"}</span>
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative py-10 sm:py-20 bg-muted/30 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-l from-violet-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-linear-to-r from-pink-500/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-violet-500/30 text-violet-600 dark:text-violet-400"
              >
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to{" "}
                <span className="bg-linear-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  ship fast
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                All the modern tools and best practices, pre-configured and
                ready for production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient border effect */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-px bg-card rounded-lg" />

                  <CardContent className="relative p-6">
                    <div
                      className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:bg-linear-to-r group-hover:from-violet-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="stack" className="relative py-10 sm:py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-violet-500/5 to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
              >
                Tech Stack
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built with{" "}
                <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  modern technologies
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Leveraging the latest and greatest tools in the React ecosystem.
              </p>
            </div>

            {/* Floating stack image */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-pink-500/20 rounded-full blur-3xl opacity-50" />
                <Image
                  src="/stack.svg"
                  alt="Tech Stack"
                  width={200}
                  height={140}
                  className="relative animate-float"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {techStack.map((tech, index) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-4 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`relative w-20 h-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center group-hover:shadow-2xl ${tech.color} group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="relative"
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <DocsSection />

        {/* Getting Started Section */}
        <section
          id="getting-started"
          className="relative py-10 sm:py-20 bg-muted/30 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              >
                Quick Start
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Get started in{" "}
                <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  minutes
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Clone the repository and start building your next great project.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden border-0 shadow-2xl">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-md flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Terminal
                    </span>
                  </div>
                </div>

                {/* Terminal content */}
                <CardContent className="p-0 bg-gray-950">
                  <div className="p-6 font-mono text-sm space-y-3">
                    <div className="flex items-start gap-2 group">
                      <span className="text-emerald-400">$</span>
                      <code className="text-gray-300 group-hover:text-white transition-colors">
                        git clone
                        https://github.com/Elanrif/kickstart-nextjs-template
                      </code>
                    </div>
                    <div className="flex items-start gap-2 group">
                      <span className="text-emerald-400">$</span>
                      <code className="text-gray-300 group-hover:text-white transition-colors">
                        cd kickstart-nextjs-template
                      </code>
                    </div>
                    <div className="flex items-start gap-2 group">
                      <span className="text-emerald-400">$</span>
                      <code className="text-gray-300 group-hover:text-white transition-colors">
                        npm install
                      </code>
                    </div>
                    <div className="flex items-start gap-2 group">
                      <span className="text-emerald-400">$</span>
                      <code className="text-gray-300 group-hover:text-white transition-colors">
                        npm run dev
                      </code>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-white/10">
                      <span className="text-cyan-400">→</span>
                      <code className="text-cyan-300">
                        Ready on http://localhost:3000
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                  asChild
                >
                  <a
                    href="https://vercel.com/new/clone?repository-url=https://github.com/Elanrif/kickstart-nextjs-template"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/vercel.svg"
                      alt="Vercel"
                      width={16}
                      height={16}
                      className="mr-2 invert"
                    />
                    Deploy to Vercel
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  asChild
                >
                  <a
                    href="https://github.com/Elanrif/kickstart-nextjs-template"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Star on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

              {/* Animated shapes */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-300" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-3xl" />
              </div>

              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,transparent,white)]" />

              {/* Floating rocket */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
                <Image
                  src="/rocket.svg"
                  alt=""
                  width={120}
                  height={120}
                  className="animate-float opacity-80"
                />
              </div>

              <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  Ready to build something
                  <span className="block mt-2 bg-linear-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                    amazing?
                  </span>
                </h2>
                <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                  Start your next project with this template and focus on what
                  matters — building great products that users love.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-violet-600 hover:bg-gray-100 shadow-xl shadow-black/20 font-semibold"
                    asChild
                  >
                    <a
                      href="https://github.com/Elanrif/kickstart-nextjs-template"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Use This Template
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                    asChild
                  >
                    <a
                      href="https://nextjs.org/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Read Documentation
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
