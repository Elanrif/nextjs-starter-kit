import Image from "next/image";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Custom Background Image + Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Beautiful background"
          fill
          className="object-cover object-center opacity-80 blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-violet-900/60 via-transparent to-pink-900/60" />
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
          <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            A production-ready template with everything you need to build modern
            web applications. TypeScript, Tailwind CSS, shadcn/ui, ESLint,
            Prettier, and more — all pre-configured and ready to go.
          </p>

          {/* Deploy on vercel */}
          <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto group" asChild>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy on Vercel
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
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a
                href="https://github.com/Elanrif/kickstart-nextjs-starter-kit"
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
        </div>
      </div>
    </section>
  );
}
