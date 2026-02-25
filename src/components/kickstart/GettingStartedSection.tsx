import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function GettingStartedSection() {
  return (
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
                    https://github.com/Elanrif/kickstart-nextjs-betterauth-template
                  </code>
                </div>
                <div className="flex items-start gap-2 group">
                  <span className="text-emerald-400">$</span>
                  <code className="text-gray-300 group-hover:text-white transition-colors">
                    cd kickstart-nextjs-betterauth-template
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
                href="https://vercel.com/new/clone?repository-url=https://github.com/Elanrif/kickstart-nextjs-betterauth-template"
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
                href="https://github.com/Elanrif/kickstart-nextjs-betterauth-template"
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
  );
}
